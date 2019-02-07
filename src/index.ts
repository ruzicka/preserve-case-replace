import * as changeCase from 'change-case'
import * as pluralize from 'pluralize'

function isFirstUpper(str: string) {
  return changeCase.isUpper(str[0]) && changeCase.isLower(str.substring(1))
}

function getAllDividers(args: any[], numberOfTerms: number) {
  const dividers: string[] = []
  for (let i = 0; i < (numberOfTerms - 1); i++) {
    dividers.push(args[2 + i * 2])
  }
  return dividers
}

function getAllTerms(args: any[], numberOfTerms: number) {
  const terms: string[] = []
  for (let i = 0; i < numberOfTerms; i++) {
    terms.push(args[1 + i * 2])
  }
  return terms
}

function allDividersEqualsTo(dividers: string[], equalsTo: string) {
  return dividers.every(divider => divider === equalsTo)
}

function allButFirstTermCaseIs(terms: string[], isCaseFnc: (str: string, ...rest: any) => any) {
  return terms.slice(1).every(term => Boolean(isCaseFnc(term)))
}

export default function replace(inputText: string, searchFor: string, replaceWith: string) {
  const originalSearchTerms = changeCase.noCase(searchFor).split(' ')

  const lastTerm = originalSearchTerms[originalSearchTerms.length - 1]
  const lastTermSingular = pluralize.singular(lastTerm)
  const lastTermPlural = pluralize(lastTerm)

  // Order of lastTermPlural|lastTermSingular matters, plural needs to be first, otherwise example|examples will match
  // only 'example' part of the possibly plural occurrence in the text.
  const rgxLastPart = `${lastTermPlural}|${lastTermSingular}`
  const rgxParts = [...originalSearchTerms.slice(0, originalSearchTerms.length - 1), rgxLastPart]
    .map(part => `(${part})`)
  const rgxString = `(${rgxParts.join('([_ -]?)')})`
  // console.log(rgxString)
  const rgx = new RegExp(rgxString, 'gmiu')

  return inputText.replace(rgx, (match: string, ...args) => {
    // all terms found in the searched
    const foundTerms = getAllTerms(args, originalSearchTerms.length)
    const lastTermIndex = originalSearchTerms.length - 1

    // sometimes the ending 'S' character might be matched that is actually part of the next term
    // like in `templateExampleSchema`. In such case, we need to compensate and remove extra S from the
    // end of the replacement string.
    const extraS = foundTerms[lastTermIndex].endsWith('S') && !changeCase.isUpperCase(foundTerms[lastTermIndex])
    if (extraS) {
      foundTerms[lastTermIndex] = foundTerms[lastTermIndex].substring(0, foundTerms[lastTermIndex].length - 1)
    }

    const first = foundTerms[0]
    const last = foundTerms[lastTermIndex]
    const isPlural = pluralize.isPlural(last)

    let newCase: string

    // console.log(last, changeCase.isUpperCase(last), changeCase.isLowerCase(last), isFirstUpper(last))

    if (originalSearchTerms.length === 1) {
      if (changeCase.isUpperCase(last)) {
        newCase = changeCase.upperCase(replaceWith)
      } else if (changeCase.isLowerCase(last)) {
        newCase = changeCase.lowerCase(replaceWith)
      } else if (isFirstUpper(last)) {
        newCase = changeCase.pascalCase(replaceWith)
      } else {
        return match // matched string wasn't of any supported case style => no replacement made
      }
    } else {
      const dividers = getAllDividers(args, originalSearchTerms.length)
      if (!allDividersEqualsTo(dividers, dividers[0])) {
        return match // inconsistent dividers
      }

      if (changeCase.isUpperCase(first) &&
        dividers[0] === '_' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isUpperCase)) {
        newCase = changeCase.constantCase(replaceWith)
      } else if (changeCase.isUpperCase(first) &&
        dividers[0] === ' ' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isUpperCase)) {
        newCase = changeCase.upperCase(changeCase.noCase(replaceWith))
      } else if (changeCase.isLowerCase(first) &&
        dividers[0] === '-' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isLowerCase)) {
        newCase = changeCase.paramCase(replaceWith)
      } else if (changeCase.isLowerCase(first) &&
        dividers[0] === '_' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isLowerCase)) {
        newCase = changeCase.snakeCase(replaceWith)
      } else if (changeCase.isLowerCase(first) &&
        dividers[0] === '' &&
        allButFirstTermCaseIs(foundTerms, isFirstUpper)) {
        newCase = changeCase.camelCase(replaceWith)
      } else if (isFirstUpper(first) &&
        dividers[0] === '' &&
        allButFirstTermCaseIs(foundTerms, isFirstUpper)) {
        newCase = changeCase.pascalCase(replaceWith)
      } else if (isFirstUpper(first) &&
        dividers[0] === ' ' &&
        allButFirstTermCaseIs(foundTerms, isFirstUpper)) {
        newCase = changeCase.titleCase(replaceWith)
      } else if (isFirstUpper(first) &&
        dividers[0] === ' ' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isLowerCase)) {
        newCase = changeCase.sentenceCase(replaceWith)
      } else if (changeCase.isLowerCase(first) &&
        dividers[0] === ' ' &&
        allButFirstTermCaseIs(foundTerms, changeCase.isLowerCase)) {
        newCase = changeCase.noCase(replaceWith)
      } else {
        return match // matched string wasn't of any supported case style => no replacement made
      }
    }

    const retVal = isPlural ? pluralize(newCase) : pluralize.singular(newCase)
    return extraS ? `${retVal}S` : retVal // append extra S if it was matched (see above)
  })

}
