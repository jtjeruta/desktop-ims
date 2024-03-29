module.exports.UsersView = (userDocuments) => {
    return userDocuments.map((userDocument) => this.UserView(userDocument))
}

module.exports.UserView = (userDocument) => {
    return {
        id: userDocument._id,
        username: userDocument.username,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        role: userDocument.role,
    }
}
