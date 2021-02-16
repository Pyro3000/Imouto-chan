function Player() {
	const alignment = 'Villager';
	const description = 'You should not be seeing this';
	const canInvestigate = false;
	const canNightKill = false;
	const canProtect = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Villager() {
	const alignment = 'Villager';
	const description = 'You are a standard villager.';
	const canInvestigate = false;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	
}

function Mafia() {
	const alignment = 'Villager';
	const description = 'You are member of the mafia.';
	const canInvestigate = false;
	const canNightKill = true;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Doctor() {
	const alignment = 'Villager';
	const description = 'You are the Doctor.  Protect someone at night with $protect <username>.';
	const canInvestigate = false;
	const canProtect = true;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Detective() {
	const alignment = 'Villager';
	const description = 'You are the Detective.  Investigate someone at night with $investigate <username>.';
	const canInvestigate = true;
	const canProtect = false;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Jailkeeper() {
	const alignment = 'Villager';
	const description = 'You are the Jailkeeper.  Jail someone at night with $jail <username>.';
	const canInvestigate = false;
	const canProtect = false;
	const canNightKill = false;
	const canJail = true;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Roleblocker() {
	const alignment = 'Mafia';
	const description = 'You are the Mafia Roleblocker.  Roleblock someone at night with $roleblock <username>.';
	const canInvestigate = false;
	const canProtect = false;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = true;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}

function Bulletproof() {
	const alignment = 'Villager';
	const description = 'You are Bulletproof.  You can survive one night attack';
	const canInvestigate = false;
	const canProtect = false;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = false;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = true;
	var isRoleBlocked = false;
}

function Tracker() {
	const alignment = 'Villager';
	const description = 'You are the Tracker.  Follow someone at night with $track <username>.';
	const canInvestigate = false;
	const canProtect = false;
	const canNightKill = false;
	const canJail = false;
	const canRoleBlock = false;
	const canTrack = true;
	
	var alive = true;
	var underProtection = false;
	var isJailed = false;
	var isBulletproof = false;
	var isRoleBlocked = false;
}