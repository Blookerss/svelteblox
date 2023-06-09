import { get } from 'svelte/store';
import { trans } from './localisation';
import * as toast from './toast';
import { fullRequest } from './api';
import { getCsrfToken } from './api/auth';
import { clientChannel } from './settings';
export async function getLaunchUri(type: 'RequestFollowUser' | 'RequestPrivateGame' | 'RequestGameJob', params: Record<string, string>) {
	const url = new URL('https://assetgame.roblox.com/game/PlaceLauncher.ashx');
	for (const [key, value] of Object.entries({ request: type, ...params }))
		url.searchParams.set(key, value);

	return url.toString();
}

export async function getTicket() {
	const ticket = await fullRequest('https://auth.roblox.com/v1/authentication-ticket', 'POST', null, {
		'x-csrf-token': await getCsrfToken()
	}).then(response => response.headers.get('rbx-authentication-ticket'));
	if (!ticket)
		throw new Error();

	return ticket;
}

export function launchClient(ticket: string, launchUri: string) {
	const channel = get(clientChannel);
	location.href = `roblox-player:1+launchmode:play+gameinfo:${ticket}+placelauncherurl:${encodeURIComponent(launchUri)}+channel:${channel === 'live' ? '' : channel}+LaunchExp:InApp`;
}
export function launchStudio(placeId: number, universeId: number, task: string) {
	location.href = `roblox-studio:1+launchmode:edit+task:${task}+placeId:${placeId}+universeId:${universeId}`;
}

export async function joinExperience(placeId: number) {
	//location.href = `roblox://placeId=${placeId}`;
	const ticket = await getTicket();
	const launchUri = await getLaunchUri('RequestGameJob', { placeId: placeId.toString() });
	launchClient(ticket, launchUri);

	toast.success(trans('toast.client_play'), trans('toast.client_launched'));
}

export async function joinUser(userId: number) {
	const ticket = await getTicket();
	const launchUri = await getLaunchUri('RequestFollowUser', { userId: userId.toString() });
	launchClient(ticket, launchUri);

	toast.success(trans('toast.client_join'), trans('toast.client_launched'));
}

export async function joinServer(placeId: number, serverId: string) {
	const ticket = await getTicket();
	const launchUri = await getLaunchUri('RequestGameJob', { placeId: placeId.toString(), joinAttemptId: serverId });
	launchClient(ticket, launchUri);

	toast.success(trans('toast.client_play'), trans('toast.client_launched'));
}

export async function joinPrivateServer(placeId: number, accessCode: string) {
	const ticket = await getTicket();
	const launchUri = await getLaunchUri('RequestPrivateGame', { placeId: placeId.toString(), accessCode });
	launchClient(ticket, launchUri);

	toast.success(trans('toast.client_join2'), trans('toast.client_launched'));
}

export async function editExperience(placeId: number, universeId: number) {
	launchStudio(placeId, universeId, 'EditPlace');
	toast.success(trans('toast.studio_edit'), trans('toast.studio_launched'));
}