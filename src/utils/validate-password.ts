import bcrypt from "bcrypt";
export const validatePassword = async (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        console.log(result)
        resolve(result);
      }
    });
  });
};
