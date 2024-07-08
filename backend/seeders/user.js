import { User } from "../models/userModel.js"
import { faker } from "@faker-js/faker"

const createUser = async (numOfUser) => {

    try {
        let userPromises = []
        for (let i = 0; i < numOfUser; i++) {
            const tempUser = await User.create({
                name: faker.person.firstName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(),
                password: "Admin@123", // Example password, consider hashing in a real application
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            });



            userPromises.push(tempUser)
        }

        await Promise.all(userPromises)
        console.log(`${numOfUser} has created`)
        process.exit(1)
    } catch (error) {
        console.log(error)
    }
}

export { createUser }