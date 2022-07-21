
require('chai')
    .use(require('chai-as-promised'))
    .should()
const truffleAssert = require('truffle-assertions');


contract('ParallelReborn', ([owner, player1Address, player2Address]) => {

    beforeEach(async () => {
        console.log("- NEW CONTRACT -")
    })

    afterEach(async () => {
    });

    describe('ParallelReborn deployment', async () => {
        it('ParallelReborn game setup', async () => {
        })
    })
})