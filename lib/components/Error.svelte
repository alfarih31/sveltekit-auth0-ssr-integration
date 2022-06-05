<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/icon-button';
	import { homePath } from '$configs/client/route.config';

	const ErrorMessageMap: { [key: number]: string } = {
		100: 'Continue',
		101: 'SwitchingProtocols',
		102: 'Processing',
		103: 'EarlyHints',
		200: 'OK',
		201: 'Created',
		202: 'Accepted',
		203: 'NonAuthoritativeInfo',
		204: 'NoContent',
		205: 'ResetContent',
		206: 'PartialContent',
		207: 'MultiStatus',
		208: 'AlreadyReported',
		226: 'IMUsed',
		300: 'MultipleChoices',
		301: 'MovedPermanently',
		302: 'Found',
		303: 'SeeOther',
		304: 'NotModified',
		305: 'UseProxy',
		306: '_',
		307: 'TemporaryRedirect',
		308: 'PermanentRedirect',
		400: 'BadRequest',
		401: 'Unauthorized',
		402: 'PaymentRequired',
		403: 'Forbidden',
		404: 'NotFound',
		405: 'MethodNotAllowed',
		406: 'NotAcceptable',
		407: 'ProxyAuthRequired',
		408: 'RequestTimeout',
		409: 'Conflict',
		410: 'Gone',
		411: 'LengthRequired',
		412: 'PreconditionFailed',
		413: 'RequestEntityTooLarge',
		414: 'RequestURITooLong',
		415: 'UnsupportedMediaType',
		416: 'RequestedRangeNotSatisfiable',
		417: 'ExpectationFailed',
		418: 'Teapot',
		421: 'MisdirectedRequest',
		422: 'UnprocessableEntity',
		423: 'Locked',
		424: 'FailedDependency',
		425: 'TooEarly',
		426: 'UpgradeRequired',
		428: 'PreconditionRequired',
		429: 'TooManyRequests',
		431: 'RequestHeaderFieldsTooLarge',
		451: 'UnavailableForLegalReasons',

		500: 'InternalServerError',
		501: 'NotImplemented',
		502: 'BadGateway',
		503: 'ServiceUnavailable',
		504: 'GatewayTimeout',
		505: 'HTTPVersionNotSupported',
		506: 'VariantAlsoNegotiates',
		507: 'InsufficientStorage',
		508: 'LoopDetected',
		510: 'NotExtended',
		511: 'NetworkAuthenticationRequired',
	};

	export let status: number;
	export let error: Error;
</script>

<div class="FlexContainer--Center--Col">
	<div class="mdc-typography--headline1">{status}</div>

	<div class="mdc-typography--headline2">{error ? error.message : ErrorMessageMap[status]}</div>

	<Button href={homePath}>
		<Icon class="material-icons">home</Icon>
		<Label>Back to home</Label>
	</Button>
</div>
