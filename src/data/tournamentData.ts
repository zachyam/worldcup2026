import type { Team, Match, Group } from '../types/tournament';

export const teams: Team[] = [
  // Group A
  { name: 'Mexico', code: 'MEX', group: 'A', isHost: true },
  { name: 'South Africa', code: 'RSA', group: 'A' },
  { name: 'South Korea', code: 'KOR', group: 'A' },
  { name: 'Czech Republic', code: 'CZE', group: 'A' },

  // Group B
  { name: 'Canada', code: 'CAN', group: 'B', isHost: true },
  { name: 'Bosnia and Herzegovina', code: 'BIH', group: 'B' },
  { name: 'Qatar', code: 'QAT', group: 'B' },
  { name: 'Switzerland', code: 'SUI', group: 'B' },

  // Group C
  { name: 'Brazil', code: 'BRA', group: 'C' },
  { name: 'Morocco', code: 'MAR', group: 'C' },
  { name: 'Haiti', code: 'HAI', group: 'C' },
  { name: 'Scotland', code: 'SCO', group: 'C' },

  // Group D
  { name: 'United States', code: 'USA', group: 'D', isHost: true },
  { name: 'Paraguay', code: 'PAR', group: 'D' },
  { name: 'Australia', code: 'AUS', group: 'D' },
  { name: 'Turkey', code: 'TUR', group: 'D' },

  // Group E
  { name: 'Germany', code: 'GER', group: 'E' },
  { name: 'Curaçao', code: 'CUW', group: 'E' },
  { name: 'Ivory Coast', code: 'CIV', group: 'E' },
  { name: 'Ecuador', code: 'ECU', group: 'E' },

  // Group F
  { name: 'Netherlands', code: 'NED', group: 'F' },
  { name: 'Japan', code: 'JPN', group: 'F' },
  { name: 'Sweden', code: 'SWE', group: 'F' },
  { name: 'Tunisia', code: 'TUN', group: 'F' },

  // Group G
  { name: 'Belgium', code: 'BEL', group: 'G' },
  { name: 'Egypt', code: 'EGY', group: 'G' },
  { name: 'Iran', code: 'IRN', group: 'G' },
  { name: 'New Zealand', code: 'NZL', group: 'G' },

  // Group H
  { name: 'Spain', code: 'ESP', group: 'H' },
  { name: 'Cape Verde', code: 'CPV', group: 'H' },
  { name: 'Saudi Arabia', code: 'KSA', group: 'H' },
  { name: 'Uruguay', code: 'URY', group: 'H' },

  // Group I
  { name: 'France', code: 'FRA', group: 'I' },
  { name: 'Senegal', code: 'SEN', group: 'I' },
  { name: 'Iraq', code: 'IRQ', group: 'I' },
  { name: 'Norway', code: 'NOR', group: 'I' },

  // Group J
  { name: 'Argentina', code: 'ARG', group: 'J' },
  { name: 'Algeria', code: 'ALG', group: 'J' },
  { name: 'Austria', code: 'AUT', group: 'J' },
  { name: 'Jordan', code: 'JOR', group: 'J' },

  // Group K
  { name: 'Portugal', code: 'POR', group: 'K' },
  { name: 'DR Congo', code: 'COD', group: 'K' },
  { name: 'Uzbekistan', code: 'UZB', group: 'K' },
  { name: 'Colombia', code: 'COL', group: 'K' },

  // Group L
  { name: 'England', code: 'ENG', group: 'L' },
  { name: 'Croatia', code: 'CRO', group: 'L' },
  { name: 'Ghana', code: 'GHA', group: 'L' },
  { name: 'Panama', code: 'PAN', group: 'L' },
];

const getTeam = (name: string): Team => teams.find(t => t.name === name)!;

export const groupMatches: Match[] = [
  // Group A
  { id: 'M1', matchNumber: 1, date: '2026-06-11', team1: getTeam('Mexico'), team2: getTeam('South Africa'), stage: 'group', group: 'A' },
  { id: 'M2', matchNumber: 2, date: '2026-06-11', team1: getTeam('South Korea'), team2: getTeam('Czech Republic'), stage: 'group', group: 'A' },
  { id: 'M25', matchNumber: 25, date: '2026-06-18', team1: getTeam('Czech Republic'), team2: getTeam('South Africa'), stage: 'group', group: 'A' },
  { id: 'M28', matchNumber: 28, date: '2026-06-18', team1: getTeam('Mexico'), team2: getTeam('South Korea'), stage: 'group', group: 'A' },
  { id: 'M53', matchNumber: 53, date: '2026-06-24', team1: getTeam('Czech Republic'), team2: getTeam('Mexico'), stage: 'group', group: 'A' },
  { id: 'M54', matchNumber: 54, date: '2026-06-24', team1: getTeam('South Africa'), team2: getTeam('South Korea'), stage: 'group', group: 'A' },

  // Group B
  { id: 'M3', matchNumber: 3, date: '2026-06-12', team1: getTeam('Canada'), team2: getTeam('Bosnia and Herzegovina'), stage: 'group', group: 'B' },
  { id: 'M8', matchNumber: 8, date: '2026-06-13', team1: getTeam('Qatar'), team2: getTeam('Switzerland'), stage: 'group', group: 'B' },
  { id: 'M26', matchNumber: 26, date: '2026-06-18', team1: getTeam('Switzerland'), team2: getTeam('Bosnia and Herzegovina'), stage: 'group', group: 'B' },
  { id: 'M27', matchNumber: 27, date: '2026-06-18', team1: getTeam('Canada'), team2: getTeam('Qatar'), stage: 'group', group: 'B' },
  { id: 'M51', matchNumber: 51, date: '2026-06-24', team1: getTeam('Switzerland'), team2: getTeam('Canada'), stage: 'group', group: 'B' },
  { id: 'M52', matchNumber: 52, date: '2026-06-24', team1: getTeam('Bosnia and Herzegovina'), team2: getTeam('Qatar'), stage: 'group', group: 'B' },

  // Group C
  { id: 'M7', matchNumber: 7, date: '2026-06-13', team1: getTeam('Brazil'), team2: getTeam('Morocco'), stage: 'group', group: 'C' },
  { id: 'M5', matchNumber: 5, date: '2026-06-13', team1: getTeam('Haiti'), team2: getTeam('Scotland'), stage: 'group', group: 'C' },
  { id: 'M30', matchNumber: 30, date: '2026-06-19', team1: getTeam('Scotland'), team2: getTeam('Morocco'), stage: 'group', group: 'C' },
  { id: 'M29', matchNumber: 29, date: '2026-06-19', team1: getTeam('Brazil'), team2: getTeam('Haiti'), stage: 'group', group: 'C' },
  { id: 'M49', matchNumber: 49, date: '2026-06-24', team1: getTeam('Scotland'), team2: getTeam('Brazil'), stage: 'group', group: 'C' },
  { id: 'M50', matchNumber: 50, date: '2026-06-24', team1: getTeam('Morocco'), team2: getTeam('Haiti'), stage: 'group', group: 'C' },

  // Group D
  { id: 'M4', matchNumber: 4, date: '2026-06-12', team1: getTeam('United States'), team2: getTeam('Paraguay'), stage: 'group', group: 'D' },
  { id: 'M6', matchNumber: 6, date: '2026-06-13', team1: getTeam('Australia'), team2: getTeam('Turkey'), stage: 'group', group: 'D' },
  { id: 'M32', matchNumber: 32, date: '2026-06-19', team1: getTeam('United States'), team2: getTeam('Australia'), stage: 'group', group: 'D' },
  { id: 'M31', matchNumber: 31, date: '2026-06-19', team1: getTeam('Turkey'), team2: getTeam('Paraguay'), stage: 'group', group: 'D' },
  { id: 'M59', matchNumber: 59, date: '2026-06-25', team1: getTeam('Turkey'), team2: getTeam('United States'), stage: 'group', group: 'D' },
  { id: 'M60', matchNumber: 60, date: '2026-06-25', team1: getTeam('Paraguay'), team2: getTeam('Australia'), stage: 'group', group: 'D' },

  // Group E
  { id: 'M10', matchNumber: 10, date: '2026-06-14', team1: getTeam('Germany'), team2: getTeam('Curaçao'), stage: 'group', group: 'E' },
  { id: 'M9', matchNumber: 9, date: '2026-06-14', team1: getTeam('Ivory Coast'), team2: getTeam('Ecuador'), stage: 'group', group: 'E' },
  { id: 'M33', matchNumber: 33, date: '2026-06-20', team1: getTeam('Germany'), team2: getTeam('Ivory Coast'), stage: 'group', group: 'E' },
  { id: 'M34', matchNumber: 34, date: '2026-06-20', team1: getTeam('Ecuador'), team2: getTeam('Curaçao'), stage: 'group', group: 'E' },
  { id: 'M55', matchNumber: 55, date: '2026-06-25', team1: getTeam('Curaçao'), team2: getTeam('Ivory Coast'), stage: 'group', group: 'E' },
  { id: 'M56', matchNumber: 56, date: '2026-06-25', team1: getTeam('Ecuador'), team2: getTeam('Germany'), stage: 'group', group: 'E' },

  // Group F
  { id: 'M11', matchNumber: 11, date: '2026-06-14', team1: getTeam('Netherlands'), team2: getTeam('Japan'), stage: 'group', group: 'F' },
  { id: 'M12', matchNumber: 12, date: '2026-06-14', team1: getTeam('Sweden'), team2: getTeam('Tunisia'), stage: 'group', group: 'F' },
  { id: 'M35', matchNumber: 35, date: '2026-06-20', team1: getTeam('Netherlands'), team2: getTeam('Sweden'), stage: 'group', group: 'F' },
  { id: 'M36', matchNumber: 36, date: '2026-06-20', team1: getTeam('Tunisia'), team2: getTeam('Japan'), stage: 'group', group: 'F' },
  { id: 'M57', matchNumber: 57, date: '2026-06-25', team1: getTeam('Japan'), team2: getTeam('Sweden'), stage: 'group', group: 'F' },
  { id: 'M58', matchNumber: 58, date: '2026-06-25', team1: getTeam('Tunisia'), team2: getTeam('Netherlands'), stage: 'group', group: 'F' },

  // Group G
  { id: 'M16', matchNumber: 16, date: '2026-06-15', team1: getTeam('Belgium'), team2: getTeam('Egypt'), stage: 'group', group: 'G' },
  { id: 'M15', matchNumber: 15, date: '2026-06-15', team1: getTeam('Iran'), team2: getTeam('New Zealand'), stage: 'group', group: 'G' },
  { id: 'M39', matchNumber: 39, date: '2026-06-21', team1: getTeam('Belgium'), team2: getTeam('Iran'), stage: 'group', group: 'G' },
  { id: 'M40', matchNumber: 40, date: '2026-06-21', team1: getTeam('New Zealand'), team2: getTeam('Egypt'), stage: 'group', group: 'G' },
  { id: 'M63', matchNumber: 63, date: '2026-06-26', team1: getTeam('Egypt'), team2: getTeam('Iran'), stage: 'group', group: 'G' },
  { id: 'M64', matchNumber: 64, date: '2026-06-26', team1: getTeam('New Zealand'), team2: getTeam('Belgium'), stage: 'group', group: 'G' },

  // Group H
  { id: 'M14', matchNumber: 14, date: '2026-06-15', team1: getTeam('Spain'), team2: getTeam('Cape Verde'), stage: 'group', group: 'H' },
  { id: 'M13', matchNumber: 13, date: '2026-06-15', team1: getTeam('Saudi Arabia'), team2: getTeam('Uruguay'), stage: 'group', group: 'H' },
  { id: 'M38', matchNumber: 38, date: '2026-06-21', team1: getTeam('Spain'), team2: getTeam('Saudi Arabia'), stage: 'group', group: 'H' },
  { id: 'M37', matchNumber: 37, date: '2026-06-21', team1: getTeam('Uruguay'), team2: getTeam('Cape Verde'), stage: 'group', group: 'H' },
  { id: 'M65', matchNumber: 65, date: '2026-06-26', team1: getTeam('Cape Verde'), team2: getTeam('Saudi Arabia'), stage: 'group', group: 'H' },
  { id: 'M66', matchNumber: 66, date: '2026-06-26', team1: getTeam('Uruguay'), team2: getTeam('Spain'), stage: 'group', group: 'H' },

  // Group I
  { id: 'M17', matchNumber: 17, date: '2026-06-16', team1: getTeam('France'), team2: getTeam('Senegal'), stage: 'group', group: 'I' },
  { id: 'M18', matchNumber: 18, date: '2026-06-16', team1: getTeam('Iraq'), team2: getTeam('Norway'), stage: 'group', group: 'I' },
  { id: 'M42', matchNumber: 42, date: '2026-06-22', team1: getTeam('France'), team2: getTeam('Iraq'), stage: 'group', group: 'I' },
  { id: 'M41', matchNumber: 41, date: '2026-06-22', team1: getTeam('Norway'), team2: getTeam('Senegal'), stage: 'group', group: 'I' },
  { id: 'M61', matchNumber: 61, date: '2026-06-26', team1: getTeam('Norway'), team2: getTeam('France'), stage: 'group', group: 'I' },
  { id: 'M62', matchNumber: 62, date: '2026-06-26', team1: getTeam('Senegal'), team2: getTeam('Iraq'), stage: 'group', group: 'I' },

  // Group J
  { id: 'M19', matchNumber: 19, date: '2026-06-16', team1: getTeam('Argentina'), team2: getTeam('Algeria'), stage: 'group', group: 'J' },
  { id: 'M20', matchNumber: 20, date: '2026-06-16', team1: getTeam('Austria'), team2: getTeam('Jordan'), stage: 'group', group: 'J' },
  { id: 'M43', matchNumber: 43, date: '2026-06-22', team1: getTeam('Argentina'), team2: getTeam('Austria'), stage: 'group', group: 'J' },
  { id: 'M44', matchNumber: 44, date: '2026-06-22', team1: getTeam('Jordan'), team2: getTeam('Algeria'), stage: 'group', group: 'J' },
  { id: 'M69', matchNumber: 69, date: '2026-06-27', team1: getTeam('Algeria'), team2: getTeam('Austria'), stage: 'group', group: 'J' },
  { id: 'M70', matchNumber: 70, date: '2026-06-27', team1: getTeam('Jordan'), team2: getTeam('Argentina'), stage: 'group', group: 'J' },

  // Group K
  { id: 'M23', matchNumber: 23, date: '2026-06-17', team1: getTeam('Portugal'), team2: getTeam('DR Congo'), stage: 'group', group: 'K' },
  { id: 'M24', matchNumber: 24, date: '2026-06-17', team1: getTeam('Uzbekistan'), team2: getTeam('Colombia'), stage: 'group', group: 'K' },
  { id: 'M47', matchNumber: 47, date: '2026-06-23', team1: getTeam('Portugal'), team2: getTeam('Uzbekistan'), stage: 'group', group: 'K' },
  { id: 'M48', matchNumber: 48, date: '2026-06-23', team1: getTeam('Colombia'), team2: getTeam('DR Congo'), stage: 'group', group: 'K' },
  { id: 'M71', matchNumber: 71, date: '2026-06-27', team1: getTeam('Colombia'), team2: getTeam('Portugal'), stage: 'group', group: 'K' },
  { id: 'M72', matchNumber: 72, date: '2026-06-27', team1: getTeam('DR Congo'), team2: getTeam('Uzbekistan'), stage: 'group', group: 'K' },

  // Group L
  { id: 'M22', matchNumber: 22, date: '2026-06-17', team1: getTeam('England'), team2: getTeam('Croatia'), stage: 'group', group: 'L' },
  { id: 'M21', matchNumber: 21, date: '2026-06-17', team1: getTeam('Ghana'), team2: getTeam('Panama'), stage: 'group', group: 'L' },
  { id: 'M45', matchNumber: 45, date: '2026-06-23', team1: getTeam('England'), team2: getTeam('Ghana'), stage: 'group', group: 'L' },
  { id: 'M46', matchNumber: 46, date: '2026-06-23', team1: getTeam('Panama'), team2: getTeam('Croatia'), stage: 'group', group: 'L' },
  { id: 'M67', matchNumber: 67, date: '2026-06-27', team1: getTeam('Panama'), team2: getTeam('England'), stage: 'group', group: 'L' },
  { id: 'M68', matchNumber: 68, date: '2026-06-27', team1: getTeam('Croatia'), team2: getTeam('Ghana'), stage: 'group', group: 'L' },
];

export const groups: Group[] = [
  { name: 'A', teams: teams.filter(t => t.group === 'A'), matches: groupMatches.filter(m => m.group === 'A'), standings: [] },
  { name: 'B', teams: teams.filter(t => t.group === 'B'), matches: groupMatches.filter(m => m.group === 'B'), standings: [] },
  { name: 'C', teams: teams.filter(t => t.group === 'C'), matches: groupMatches.filter(m => m.group === 'C'), standings: [] },
  { name: 'D', teams: teams.filter(t => t.group === 'D'), matches: groupMatches.filter(m => m.group === 'D'), standings: [] },
  { name: 'E', teams: teams.filter(t => t.group === 'E'), matches: groupMatches.filter(m => m.group === 'E'), standings: [] },
  { name: 'F', teams: teams.filter(t => t.group === 'F'), matches: groupMatches.filter(m => m.group === 'F'), standings: [] },
  { name: 'G', teams: teams.filter(t => t.group === 'G'), matches: groupMatches.filter(m => m.group === 'G'), standings: [] },
  { name: 'H', teams: teams.filter(t => t.group === 'H'), matches: groupMatches.filter(m => m.group === 'H'), standings: [] },
  { name: 'I', teams: teams.filter(t => t.group === 'I'), matches: groupMatches.filter(m => m.group === 'I'), standings: [] },
  { name: 'J', teams: teams.filter(t => t.group === 'J'), matches: groupMatches.filter(m => m.group === 'J'), standings: [] },
  { name: 'K', teams: teams.filter(t => t.group === 'K'), matches: groupMatches.filter(m => m.group === 'K'), standings: [] },
  { name: 'L', teams: teams.filter(t => t.group === 'L'), matches: groupMatches.filter(m => m.group === 'L'), standings: [] },
];

// Knockout bracket structure based on the tournament draw
export const knockoutStructure = {
  round32: [
    { id: 'M73', sourcePosition1: 'Runner-up Group A', sourcePosition2: 'Runner-up Group B' },
    { id: 'M74', sourcePosition1: 'Winner Group E', sourcePosition2: '3rd Group A/B/C/D/F' },
    { id: 'M75', sourcePosition1: 'Winner Group F', sourcePosition2: 'Runner-up Group C' },
    { id: 'M76', sourcePosition1: 'Winner Group C', sourcePosition2: 'Runner-up Group F' },
    { id: 'M77', sourcePosition1: 'Winner Group I', sourcePosition2: '3rd Group C/D/F/G/H' },
    { id: 'M78', sourcePosition1: 'Runner-up Group E', sourcePosition2: 'Runner-up Group I' },
    { id: 'M79', sourcePosition1: 'Winner Group A', sourcePosition2: '3rd Group C/E/F/H/I' },
    { id: 'M80', sourcePosition1: 'Winner Group L', sourcePosition2: '3rd Group E/H/I/J/K' },
    { id: 'M81', sourcePosition1: 'Winner Group D', sourcePosition2: '3rd Group B/E/F/I/J' },
    { id: 'M82', sourcePosition1: 'Winner Group G', sourcePosition2: '3rd Group A/E/H/I/J' },
    { id: 'M83', sourcePosition1: 'Runner-up Group K', sourcePosition2: 'Runner-up Group L' },
    { id: 'M84', sourcePosition1: 'Winner Group H', sourcePosition2: 'Runner-up Group J' },
    { id: 'M85', sourcePosition1: 'Winner Group B', sourcePosition2: '3rd Group E/F/G/I/J' },
    { id: 'M86', sourcePosition1: 'Winner Group J', sourcePosition2: 'Runner-up Group H' },
    { id: 'M87', sourcePosition1: 'Winner Group K', sourcePosition2: '3rd Group D/E/I/J/L' },
    { id: 'M88', sourcePosition1: 'Runner-up Group D', sourcePosition2: 'Runner-up Group G' },
  ],
  round16: [
    { id: 'M89', sourceMatch1: 'M74', sourceMatch2: 'M77' },
    { id: 'M90', sourceMatch1: 'M73', sourceMatch2: 'M75' },
    { id: 'M91', sourceMatch1: 'M76', sourceMatch2: 'M78' },
    { id: 'M92', sourceMatch1: 'M79', sourceMatch2: 'M80' },
    { id: 'M93', sourceMatch1: 'M83', sourceMatch2: 'M84' },
    { id: 'M94', sourceMatch1: 'M81', sourceMatch2: 'M82' },
    { id: 'M95', sourceMatch1: 'M86', sourceMatch2: 'M88' },
    { id: 'M96', sourceMatch1: 'M85', sourceMatch2: 'M87' },
  ],
  quarterfinals: [
    { id: 'M97', sourceMatch1: 'M89', sourceMatch2: 'M90' },
    { id: 'M98', sourceMatch1: 'M93', sourceMatch2: 'M94' },
    { id: 'M99', sourceMatch1: 'M91', sourceMatch2: 'M92' },
    { id: 'M100', sourceMatch1: 'M95', sourceMatch2: 'M96' },
  ],
  semifinals: [
    { id: 'M101', sourceMatch1: 'M97', sourceMatch2: 'M98' },
    { id: 'M102', sourceMatch1: 'M99', sourceMatch2: 'M100' },
  ],
  thirdPlace: { id: 'M103', sourceMatch1: 'M101', sourceMatch2: 'M102', isLoser: true },
  final: { id: 'M104', sourceMatch1: 'M101', sourceMatch2: 'M102' },
};