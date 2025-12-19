import anna from './round_1/anna.json'
import auntZhang from './round_1/aunt_zhang.json'
import auntZhangInvestigate from '../investigate/round_1/aunt_zhang.json'
import michael from './round_1/michael.json'
import michaelInvestigate from '../investigate/round_1/michael.json'
import officerChan from './round_1/officer_chan.json'
import officerChanInvestigate from '../investigate/round_1/officer_chan.json'

const dialogues = {
  events: {
    ...anna,
    ...auntZhang,
    ...auntZhangInvestigate,
    ...michael,
    ...michaelInvestigate,
    ...officerChan,
    ...officerChanInvestigate
  }
}

export default dialogues
