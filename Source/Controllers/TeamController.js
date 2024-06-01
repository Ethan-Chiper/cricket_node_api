const {getNanoId, isEmpty} = require('../Helpers/Utils');
const {createTeam,findOneTeam} = require('../Repository/TeamRepository');
const TeamModel = require('../Models/Team');
const PlayerModel = require('../Models/Player');
const { createPlayer,findOnePlayer }= require('../Repository/PlayerRepository');

// const calculateBattingPoints = (runs, isCaptain, isViceCaptain) => {
//     let points = runs;
//     if (runs >= 100) points += 16; // Century Bonus
//     else if (runs >= 50) points += 8; // Half-century Bonus
//     else if (runs >= 30) points += 4; // 30 Run Bonus

//     if (isCaptain) points *= 2;
//     if (isViceCaptain) points *= 1.5;
//     return points;
// };

// const calculateBowlingPoints = (wickets, isCaptain, isViceCaptain) => {
//     let points = wickets * 25;
//     if (wickets >= 5) points += 16; // 5 Wicket Bonus
//     else if (wickets >= 4) points += 8; // 4 Wicket Bonus
//     else if (wickets >= 3) points += 4; // 3 Wicket Bonus

//     if (isCaptain) points *= 2;
//     if (isViceCaptain) points *= 1.5;
//     return points;
// };


const Controllers = {
	/**
	 * Team SignUp
	 * @param request
	 */
	addTeam: async (request) => {
		try {
            const data = request.body;

            const playerTypes = { WK: 0, BAT: 0, AR: 0, BWL: 0 };
            const teamCount = { RR: 0, CSK: 0 };

            for (const playerName of data.players) {
                const player = await PlayerModel.findOne({ name: playerName });
                if (!player) {
                    return { error: true, message: `Player ${playerName} not found` };
                }
                playerTypes[player.type]++;
                teamCount[player.team]++;
            }
            // Check min and max players rule
            for (const type in playerTypes) {
                if (playerTypes[type] < 1 || playerTypes[type] > 8) {
                    return { error: true, message: `Invalid number of ${type} players` };
                }
            }

            // Check max players from one team
            if (teamCount.RR > 10 || teamCount.CSK > 10) {
                return { error: true, message: 'Maximum 10 players can be selected from one team' };
            }

            let teamData = {
                team_id: getNanoId(),
                teamName: data?.teamName,
                players: data?.players ?? '',
                captain: data?.captain ?? '',
                viceCaptain: data?.viceCaptain,
                points: data?.points ?? 0
            };

            let team = await createTeam(teamData);
            if (!isEmpty(team)) {
                return {
                    error: false, message: 'Team created', data: { team: team }
                };
            }
            return { error: true, message: 'Data create failure' };
        } catch (error) {
            return { error: true, message: error };
        }
	},
    /**
     * Process Match Result
     * @param {*} req 
     * @param {*} res 
     */
    processResult : async (req, res) => {
        try {
            const teams = await TeamModel.find();
            const playerPoints = {};

            // Calculate points for each player based on match results
            matchResults.forEach((ball) => {
                const { batsman, bowler, runs, dismissal } = ball;

                if (!playerPoints[batsman]) playerPoints[batsman] = 0;
                if (!playerPoints[bowler]) playerPoints[bowler] = 0;

                playerPoints[batsman] += runs.batsman;

                if (runs.batsman === 4) playerPoints[batsman]++;
                if (runs.batsman === 6) playerPoints[batsman] += 2;

                if (dismissal) {
                    playerPoints[bowler] += 25;
                    if (dismissal.kind === 'bowled' || dismissal.kind === 'lbw') {
                        playerPoints[bowler] += 8;
                    }
                }
            });

            // Assign points to each team
            for (const team of teams) {
                let totalPoints = 0;
                team.players.forEach((player) => {
                    let playerPoint = playerPoints[player] || 0;
                    if (player === team.captain) playerPoint *= 2;
                    if (player === team.viceCaptain) playerPoint *= 1.5;
                    totalPoints += playerPoint;
                });
                team.points = totalPoints;
                await team.save();
            }
            return {
                error: false, message: 'Match results processed successfully'
            };
        } catch (error) {
            return { error: true, message: error };
        }
    },
    /**
     * GetTeamResults
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getTeamResults : async (req) => {
        try {
            const teams = await TeamModel.find().sort({ points: -1 });
            const maxPoints = teams.length > 0 ? teams[0].points : 0;
            const winningTeams = teams.filter((team) => team.points === maxPoints);

            return {
                error: false, winningTeams, allTeams: teams
            };
        } catch (error) {
            return { error: true, message: error };
        }
    }
};

module.exports = Controllers;
