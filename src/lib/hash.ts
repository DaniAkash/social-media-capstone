import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hash(plainText: string): Promise<string> {
	return new Promise((resolve, reject) => {
		bcrypt.hash(plainText, saltRounds, function (err, hash) {
			if (err) {
				reject(err);
			}
			resolve(hash);
			// bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
			// 	if (err) {
			// 		throw err;
			// 	}
			// 	console.log(result);
			// });
		});
	});
}

export async function compare(hash: string, userInput: string) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(userInput, hash, function (err, result) {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}
