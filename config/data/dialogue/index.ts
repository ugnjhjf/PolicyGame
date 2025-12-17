import anna from './anna.json'
import auntZhang from './aunt_zhang.json'
import auntZhangInvestigate from '../investigate/aunt_zhang.json'
import michael from './michael.json'
import michaelInvestigate from '../investigate/michael.json'

const dialogues = {
  events: {
    ...anna,
    ...auntZhang,
    ...auntZhangInvestigate,
    ...michael,
    ...michaelInvestigate
  }
}

export default dialogues
