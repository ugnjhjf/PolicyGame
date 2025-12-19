import anna from './anna.json'
import auntZhang from './aunt_zhang.json'
import auntZhangInvestigate from '../investigate/aunt_zhang.json'
import michael from './michael.json'
import michaelInvestigate from '../investigate/michael.json'
import officerChan from './officer_chan.json'
import officerChanInvestigate from '../investigate/officer_chan.json'

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
