const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
AWS.events.on('retry', function (resp) {
	if (['SignatureDoesNotMatch', 'InvalidSignatureException'].includes(resp.error.code)) {
		resp.error.retryable = true;
	}
});

const sqs = new AWS.SQS({region: 'us-west-2', correctClockSkew: true});

async function sendMessage (payload) {
	let params = {
		MessageBody: payload,
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/079818613942/AWSGoogleCloudTestSignature',
	};
	return sqs.sendMessage(params).promise();
};

async function run() {
	const message = JSON.stringify({
		"kind": "youtube#searchListResponse",
		"etag": "rwerwerwerwer",
		"nextPageToken": "ewrwerwre",
		"regionCode": "KE",
		"pageInfo": {
			"totalResults": 4249,
			"resultsPerPage": 5
		},
		"items": [
			{
				"kind": "youtube#searchResult",
				"etag": "\"m2yskBQFythfE4irbTIeOgYYfBU/QpOIr3QKlV5EUlzfFcVvDiJT0hw\"",
				"id": {
					"kind": "youtube#channel",
					"channelId": "UCJowOS1R0FnhipXVqEnYU1A"
				}
			},
			{
				"kind": "youtube#searchResult",
				"etag": "\"m2yskBQFythfE4irbTIeOgYYfBU/AWutzVOt_5p1iLVifyBdfoSTf9E\"",
				"id": {
					"kind": "youtube#video",
					"videoId": "Eqa2nAAhHN0"
				}
			},
			{
				"kind": "youtube#searchResult",
				"etag": "\"m2yskBQFythfE4irbTIeOgYYfBU/2dIR9BTfr7QphpBuY3hPU-h5u-4\"",
				"id": {
					"kind": "youtube#video",
					"videoId": "IirngItQuVs"
				}
			}
		]
	});
	for (let i = 0; i < process.env.NUM_MESSAGES; i++) {
		await sendMessage(message);
	}
};

run();
