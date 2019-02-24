let dbHelper = require("./dbHelper");

async function isEmailExist({email, id = '', db}) {
    let query;
    if (id) 
        query = `select * from user where id != ${id} and email='${email.trim()}'`;
    else
        query = `select * from user where email='${email.trim()}'`;
    
    const mailResult = await dbHelper.execQuery(query, db);
    return mailResult.data.length > 0 ? true : false
}

async function addUpdateUser(request, response) {

    let req = request.body;
    let db = dbHelper.getDBConnection();
    try {
        let query;

        if (req.id) { // Edit

            if (await isEmailExist({email: req.email,id: req.id, db}))
                return response.send({ status: false, data: 'Email Exist' });

            query = `update user set username='${req.username.trim()}', email='${req.email.trim()}',
                    dob='${req.dob}', gender='${req.gender}' where id=${req.id}`;
        } else { // Insert

            if (await isEmailExist({email: req.email, db}))
                return response.send({ status: false, data: 'Email Exist' });

            query = `insert into user(username,email,dob,gender) values
                    ('${req.username.trim()}','${req.email.trim()}','${req.dob}','${req.gender}')`;
        }
        await dbHelper.execQuery(query, db);
        return response.send({ status: true, data: req.id ? "User Updated" : "User Added" });
    }
    catch (ex) {
        console.log("Error in addProduct")
        return response.send({ status: false, data: "Error in addProduct" });
    }

}

async function getUserData(request, response) {

    let db = dbHelper.getDBConnection();
    try {
        let users = await dbHelper.execQuery(`select * from user desc`, db);
        return response.send({ status: true, data: users.data });
    }
    catch (ex) {
        return response.send({ status: false, msg: "Error in getProductListing" });
    }

}

async function deleteUser(request, response) {

    const req =request.body;

    let db = dbHelper.getDBConnection();
    try {
        await dbHelper.execQuery(`delete from user where id=${req.id}`, db);
        return response.send({ status: true, data: 'User Deleted' });
    }
    catch (ex) {
        return response.send({ status: false, msg: "Error in getProductListing" });
    }

}


module.exports = {
    addUpdateUser: addUpdateUser,
    getUserData: getUserData,
    deleteUser: deleteUser
}