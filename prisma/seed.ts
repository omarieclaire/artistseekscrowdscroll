import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createQuestion(id: string) {
    try {
        await prisma.question.create({
            data: {
                id
            }
        });
    } catch (e) {
        console.warn(e);
    }
}

async function main() {
    await createQuestion('chaosOrCalm')
    await createQuestion('darkOrJoy')
    await createQuestion('upOrDown')
    await createQuestion('down')
    await createQuestion('qSearchForPeople')
    await createQuestion('qMoreFans')
    await createQuestion('qMaterialChange')
    await createQuestion('qDeepListen')
    await createQuestion('qTransformWork')
    await createQuestion('qLoseEnergy')
    await createQuestion('outOrIn')
    await createQuestion('unfoldOrCycle')
    await createQuestion('forestOrMeadow')
    await createQuestion('morningOrNight')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
