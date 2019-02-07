import * as R from 'ramda'
import replace from './'

const multixprod = (...arrays: any[][]) => {
  let result = arrays[arrays.length - 1]
  for (let i = arrays.length - 2; i >= 0; i--) {
    result = R.xprod(arrays[i], result).map(arr => [arr[0], ...arr[1]])
  }
  return result
}

describe('Replace with preserving case', () => {

  describe('Single term replacement', () => {
    const wives = ['wife', 'Wife', 'WIFE', 'wives', 'Wives', 'WIVES']
    const apples = ['apple', 'Apple', 'APPLE', 'apples', 'Apples', 'APPLES']
    const pears = ['pear', 'Pear', 'PEAR', 'pears', 'Pears', 'PEARS']

    const testDataSingleTerm = [
      ['s01', 'text with apple in it', 'text with pear in it'],
      ['s02', 'text with apples in it', 'text with pears in it'],
      ['s03', 'text with Apple in it', 'text with Pear in it'],
      ['s04', 'text with Apples in it', 'text with Pears in it'],
      ['s05', 'text with APPLE in it', 'text with PEAR in it'],
      ['s06', 'text with APPLES in it', 'text with PEARS in it'],
      ['s07', 'text with AppleSchema in it', 'text with PearSchema in it'],
      ['s08', 'text with ApplesSchema in it', 'text with PearsSchema in it'],
      ['s09', 'text with appleSchema in it', 'text with pearSchema in it'],
    ]
    test.each(multixprod(apples, pears, testDataSingleTerm))(
      'Single term replacement %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    const testDataSingleTermIrregularA = [
      ['sia01', 'text with wife in it', 'text with pear in it'],
      ['sia02', 'text with wives in it', 'text with pears in it'],
      ['sia03', 'text with wifeSchema in it', 'text with pearSchema in it'],
      ['sia04', 'text with wivesSchema in it', 'text with pearsSchema in it'],
    ]
    test.each(multixprod(wives, pears, testDataSingleTermIrregularA))(
      'Single term replacement with irregular words %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    const testDataSingleTermIrregularB = [
      ['sib01', 'text with pear in it', 'text with wife in it'],
      ['sib02', 'text with pears in it', 'text with wives in it'],
    ]
    test.each(multixprod(pears, wives, testDataSingleTermIrregularB))(
      'Another single term replacement with irregular words %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    const invalid = [
      ['inv01', 'text with wiFe in it', 'text with wiFe in it'],
    ]
    test.each(multixprod(wives, pears, invalid))(
      'should not replace matching term when replacing %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )
  })

  describe('Double-term replacement', () => {
    const placeholders = [
      'placeholder string',
      'placeholder strings',
      'Placeholder String',
      'Placeholder Strings',
      'PLACEHOLDER STRING',
      'PLACEHOLDER STRINGS',
      'PLACEHOLDER_STRING',
      'PLACEHOLDER_STRINGS',
      'placeholder_string',
      'placeholder_strings',
      'placeholder-string',
      'placeholder-strings',
      'placeholderString',
      'placeholderStrings',
      'PlaceholderString',
      'PlaceholderStrings',
      'Placeholder string',
      'Placeholder strings',
    ]
    const actualThings = [
      'actual thing',
      'actual things',
      'Actual Thing',
      'Actual Things',
      'ACTUAL THING',
      'ACTUAL THINGS',
      'ACTUAL_THING',
      'ACTUAL_THINGS',
      'actual_thing',
      'actual_things',
      'actual-thing',
      'actual-things',
      'actualThing',
      'actualThings',
      'ActualThing',
      'ActualThings',
      'Actual thing',
      'Actual things',
    ]
    const testData = [
      ['m01', 'text containing placeholder string in it', 'text containing actual thing in it'],
      ['m02', 'text containing placeholder strings in it', 'text containing actual things in it'],
      ['m03', 'text containing PlaceholderString in it', 'text containing ActualThing in it'],
      ['m04', 'text containing PlaceholderStrings in it', 'text containing ActualThings in it'],
      ['m05', 'text containing placeholderString in it', 'text containing actualThing in it'],
      ['m06', 'text containing placeholderStrings in it', 'text containing actualThings in it'],
      ['m07', 'text containing placeholder-string in it', 'text containing actual-thing in it'],
      ['m08', 'text containing placeholder-strings in it', 'text containing actual-things in it'],
      ['m09', 'text containing placeholder_string in it', 'text containing actual_thing in it'],
      ['m10', 'text containing placeholder_strings in it', 'text containing actual_things in it'],
      ['m11', 'text containing PLACEHOLDER_STRING in it', 'text containing ACTUAL_THING in it'],
      ['m12', 'text containing PLACEHOLDER_STRINGS in it', 'text containing ACTUAL_THINGS in it'],
      ['m13', 'text containing PLACEHOLDER STRING in it', 'text containing ACTUAL THING in it'],
      ['m14', 'text containing PLACEHOLDER STRINGS in it', 'text containing ACTUAL THINGS in it'],
      ['m15', 'text containing Placeholder string in it', 'text containing Actual thing in it'],
      ['m16', 'text containing Placeholder strings in it', 'text containing Actual things in it'],
      ['m17', 'text containing Placeholder String in it', 'text containing Actual Thing in it'],
      ['m18', 'text containing Placeholder Strings in it', 'text containing Actual Things in it'],

      ['m19', 'text containing PlaceholderStringSchema in it', 'text containing ActualThingSchema in it'],
      ['m20', 'text containing PlaceholderStringsSchema in it', 'text containing ActualThingsSchema in it'],
      ['m21', 'text containing firstPlaceholderStringsSchema in it', 'text containing firstActualThingsSchema in it'],
    ]
    test.each(multixprod(placeholders, actualThings, testData))(
      'Double-term replacement %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    // const testData2 = [
    //   ['m04', 'text containing NicePlaceholderStrings in it', 'text containing RealActualThings in it'],
    // ]
    // test.only.each(multixprod(['nice placeholder string'], ['real actual thing'], testData2))(
    //   'Double-term replacement %s for %s, scenario %s',
    //   (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
    //     const output = replace(input, searchFor, replaceWith)
    //     expect(output).toEqual(expectedOutput)
    //   },
    // )

    const invalid = [
      ['minv01', 'text containing placeholderstring in it', 'text containing placeholderstring in it'],
      ['minv01', 'text containing placeholderstrings in it', 'text containing placeholderstrings in it'],
      ['minv02', 'text containing plaCEHolderstRING in it', 'text containing plaCEHolderstRING in it'],
      ['minv02', 'text containing plac-eholde-rstring in it', 'text containing plac-eholde-rstring in it'],
    ]
    test.each(multixprod(placeholders, actualThings, invalid))(
      'invalid match while replacing %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

  })

  describe('Triple-term replacement', () => {
    const placeholders = [
      'nice placeholder string',
      'nice placeholder strings',
      'Nice Placeholder String',
      'Nice Placeholder Strings',
      'NICE PLACEHOLDER STRING',
      'NICE PLACEHOLDER STRINGS',
      'NICE_PLACEHOLDER_STRING',
      'NICE_PLACEHOLDER_STRINGS',
      'nice_placeholder_string',
      'nice_placeholder_strings',
      'nice-placeholder-string',
      'nice-placeholder-strings',
      'nicePlaceholderString',
      'nicePlaceholderStrings',
      'NicePlaceholderString',
      'NicePlaceholderStrings',
      'Nice-Placeholder_String', // inconsistent separators
      'Nice PlaceholderStrings', // inconsistent separators
      'Nice-PlaceholderStrings', // inconsistent separators
      'Nice placeholder string',
      'Nice placeholder strings',
    ]
    const actualThings = [
      'real actual thing',
      'real actual things',
      'Real Actual Thing',
      'Real Actual Things',
      'REAL ACTUAL THING',
      'REAL ACTUAL THINGS',
      'REAL ACTUAL_THING',
      'REAL ACTUAL_THINGS',
      'real_actual_thing',
      'real_actual_things',
      'real-actual-thing',
      'real-actual-things',
      'realActualThing',
      'realActualThings',
      'RealActualThing',
      'RealActualThings',
      'Real-Actual_Thing', // inconsistent separators
      'Real ActualThings', // inconsistent separators
      'Real-ActualThings', // inconsistent separators
      'Real actual thing',
      'Real actual things',
    ]
    const testData = [
      ['m301', 'text containing nice placeholder string in it', 'text containing real actual thing in it'],
      ['m302', 'text containing nice placeholder strings in it', 'text containing real actual things in it'],
      ['m303', 'text containing NicePlaceholderString in it', 'text containing RealActualThing in it'],
      ['m304', 'text containing NicePlaceholderStrings in it', 'text containing RealActualThings in it'],
      ['m305', 'text containing nicePlaceholderString in it', 'text containing realActualThing in it'],
      ['m306', 'text containing nicePlaceholderStrings in it', 'text containing realActualThings in it'],
      ['m307', 'text containing nice-placeholder-string in it', 'text containing real-actual-thing in it'],
      ['m308', 'text containing nice-placeholder-strings in it', 'text containing real-actual-things in it'],
      ['m309', 'text containing nice_placeholder_string in it', 'text containing real_actual_thing in it'],
      ['m310', 'text containing nice_placeholder_strings in it', 'text containing real_actual_things in it'],
      ['m311', 'text containing NICE_PLACEHOLDER_STRING in it', 'text containing REAL_ACTUAL_THING in it'],
      ['m312', 'text containing NICE_PLACEHOLDER_STRINGS in it', 'text containing REAL_ACTUAL_THINGS in it'],
      ['m313', 'text containing NICE PLACEHOLDER STRING in it', 'text containing REAL ACTUAL THING in it'],
      ['m314', 'text containing NICE PLACEHOLDER STRINGS in it', 'text containing REAL ACTUAL THINGS in it'],
      ['m315', 'text containing Nice placeholder string in it', 'text containing Real actual thing in it'],
      ['m316', 'text containing Nice placeholder strings in it', 'text containing Real actual things in it'],
      ['m317', 'text containing Nice Placeholder String in it', 'text containing Real Actual Thing in it'],
      ['m318', 'text containing Nice Placeholder Strings in it', 'text containing Real Actual Things in it'],

      ['m319', 'text containing NicePlaceholderStringSchema in it', 'text containing RealActualThingSchema in it'],
      ['m320', 'text containing NicePlaceholderStringsSchema in it', 'text containing RealActualThingsSchema in it'],
      ['m321', 'text containing firstNicePlaceholderStringsSchema ', 'text containing firstRealActualThingsSchema '],
    ]
    test.each(multixprod(placeholders, actualThings, testData))(
      'Triple-term replacement %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    const invalid = [
      ['m3inv01', 'text containing niceplaceholderstring in it', 'text containing niceplaceholderstring in it'],
      ['m3inv01', 'text containing niceplaceholderstrings in it', 'text containing niceplaceholderstrings in it'],
      ['m3inv02', 'text containing nicEplaCEHolderstRING in it', 'text containing nicEplaCEHolderstRING in it'],
      ['m3inv02', 'text containing nic-eplac-eholde-rstring in it', 'text containing nic-eplac-eholde-rstring in it'],
    ]
    test.each(multixprod(placeholders, actualThings, invalid))(
      'invalid match while replacing %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

    const inconsistent = [
      ['m3inc01', 'text containing nice-placeholder_string in it', 'text containing nice-placeholder_string in it'],
      ['m3inc01', 'text containing nice-placeholder-String in it', 'text containing nice-placeholder-String in it'],
      ['m3inc01', 'text containing nice-placeholderString in it', 'text containing nice-placeholderString in it'],
      ['m3inc01', 'text containing nice-placeholder_String in it', 'text containing nice-placeholder_String in it'],
      ['m3inc01', 'text containing NICE_placeholder STRING in it', 'text containing NICE_placeholder STRING in it'],
    ]
    test.each(multixprod(['nice placeholder string'], ['real actual thing'], inconsistent))(
      'inconsistent separators while replacing %s for %s, scenario %s',
      (searchFor: string, replaceWith: string, {}, input: string, expectedOutput: string  ) => {
        const output = replace(input, searchFor, replaceWith)
        expect(output).toEqual(expectedOutput)
      },
    )

  })
})
