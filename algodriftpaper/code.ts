// We're using Typescript because this allows us to define custom sound-change types

type SoundChange = {
    target: string, //use "" for epenthesis but be careful
    result: string, //use "" to delete
    preceding: string[], // Use the empty string "" when what precedes or follows is irrelevant
    following: string[]
}

type HistoricalPhonology = {
    changes: SoundChange[]
}

type Phonology = string[] //This is a list of chars. It should probably distinguish vowels, true consonants, clusters...

type Lexicon = {
    phonology: Phonology,
    words: string[],
    morphemes: string[]
}

function applyPlausibleChange(lexicon: Lexicon, change: SoundChange) {

}

function applyActualChange(lexicon: Lexicon, change: SoundChange): Lexicon {

    for (let word in lexicon.words) {

    }


    return lexicon
}