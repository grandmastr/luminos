const isEmail = email => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email);

export default isEmail;
