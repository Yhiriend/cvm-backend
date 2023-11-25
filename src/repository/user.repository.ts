import connection from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import convertMinutesToMillis from "../utils/time-converter";
import { User } from "../models/user.type";

const EXPIRATION_TIME = convertMinutesToMillis(30);

export const login = async (email: string, password: string) => {
  const sql = "SELECT * FROM users WHERE email = ?";

  return new Promise((resolve, reject) => {
    connection.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        let data: any = {};
        if (result.length === 0) {
          resolve({ msg: "Invalid Email" });
        } else {
          data = result[0];
          const userPassword = data.password;
          bcrypt.compare(password, userPassword, (err, result) => {
            if (err) {
              resolve(err.message);
            } else {
              if (result) {
                const token = jwt.sign(
                  {
                    name: data.name,
                    surname: data.surname,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    age: data.age,
                    gender: data.gender
                  },
                  process.env.SECRET_KEY!,
                  {
                    expiresIn: EXPIRATION_TIME.toString(),
                  }
                );
                const dataWithoutPassword = { ...data };
                delete dataWithoutPassword.password;
                resolve({ token: token, data: dataWithoutPassword });
              } else {
                resolve({ msg: "Invalid Password" });
              }
            }
          });
        }
      }
    });
  });
};

export const signIn = async (user: User) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(user.password!, 10)
      .then((hash) => {
        connection.query(
          "INSERT INTO users SET ?",
          {
            name: user.name,
            surname: user.surname,
            password: hash,
            email: user.email,
            address: user.address,
            age: user.age,
            gender: user.gender,
            phone: user.phone,
          },
          (err, data) => {
            console.log(data);
            if (err) {
              reject(err.message);
            } else {
              const userWithoutPassword = { ...user };
              delete userWithoutPassword.password;
              resolve({
                msg: "Successfully registered",
                data: userWithoutPassword,
              });
            }
          }
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};

export const update = async (user: User, newPassword: string) => {
  console.warn('newpassword',newPassword)
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [user.id],
      (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          if (result.length === 0) {
            reject("Invalid user");
          } else {
            const updateData: User = user;

            bcrypt.compare(
              user.password!,
              result[0].password,
              (err, result) => {
                if (err) {
                  resolve(err.message);
                } else {
                  if (result) {
                    if (newPassword) {
                      bcrypt.hash(newPassword, 10).then((hash) => {
                        updateData.password = hash;

                        connection.query(
                          "UPDATE users SET ? WHERE id = ?",
                          [updateData, user.id],
                          (err, data) => {
                            if (err) {
                              reject(err.message);
                            } else {
                              resolve({
                                msg: true,
                              });
                            }
                          }
                        );
                      });
                    } else {
                      delete updateData.password;
                      connection.query(
                        "UPDATE users SET ? WHERE id = ?",
                        [updateData, user.id],
                        (err, data) => {
                          if (err) {
                            reject(err.message);
                          } else {
                            resolve({
                              msg: true,
                            });
                          }
                        }
                      );
                    }
                  } else {
                    resolve({ msg: false });
                  }
                }
              }
            );
          }
        }
      }
    );
  });
};
