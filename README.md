[![Build Status](https://travis-ci.org/ruzicka/preserve-case-replace.svg?branch=master)](https://travis-ci.org/ruzicka/preserve-case-replace)
[![Coverage Status](https://coveralls.io/repos/github/ruzicka/preserve-case-replace/badge.svg?branch=master)](https://coveralls.io/github/ruzicka/preserve-case-replace?branch=master)
# preserve-case-replace

Allows you to replace compound words or phrases in the input text with different phrases while preserving the case
and also the plural/singular form of the original text.

Probably the most useful usage of this library would be generating code based on some predefined templates.
Template in this case would be just a normal file with a code that doesnt include any tags or special marks
to indicate where the modification should occur. Instead replacement of names/identifiers inside the file
would happen automatically. This has a huge benefit in that the code in the template file would still be valid code
which would make the templates easy to test and maintain. Replacement is language agnostic, so it should work for
any programming language or just general text files.

Typescript declarations are included.

## Examples
Let's say you want to refactor `user photo` to `member file`
All you have to do is to call `replace(inputText, 'user photo', 'member file')`

All of these replacements (and more) would be performed:

```typescript
'user photo' => 'member file'
'userPhoto' => 'memberFile'
'UserPhoto' => 'memberFile'
'user-photo' => 'member-file'
'USER_PHOTO' => 'MEMBER_FILE'
```
Also plural/singular forms would be preserved:
 
```typescript
'user photos' => 'member files'
'userPhotos' => 'memberFiles'
'UserPhotos' => 'memberFiles'
'user-photos' => 'member-files'
'USER_PHOTOS' => 'MEMBER_FILES'
```
It works even for irregular words:

```typescript
replace(inputText, 'user photo', 'small puppy')
// 'userPhotos' => 'smallPuppies'

replace(inputText, 'user photo', 'big wolf')
// 'user-photos' => 'big-wolves'
```

## Install

```
npm install preserve-case-replace --save
``` 

## API

### replace(inputText, searchFor, replaceWith)
Replaces all occurrences of `searchFor` with `replaceWith`

 - `inputText` - Text to be processed
 - `searchFor` - String containing the phrase that should get replaced. You can use any case for this parameter as well
 as any of plural or singular forms. For example al of these are valid and identical in terms of how replacement works:
 `userPhoto`, `user photos`, `USER_PHOTO`
 - `replaceWith` - Phrase that should replace all occurrences of `searchFor` phrase.
 
 Returns text with all variants of `searchFor` (all cases and plural/singular forms) replaced with `replaceWith`, while
 preserving the original case and plural/singular form.

```typescript
import replace from 'preserve-case-replace'

const inputText = `
# User Photo
The file user-photo.ts Exports the UserPhoto class along with the instance userPhoto.
All data is stored in user_photos db table.`

const output = replace(inputText, 'userPhoto', 'dogOwner')

// output will contain:
//
// # Dog Owner
// The file dog-owner.ts Exports the DogOwner class along with the instance dogOwner.
// All data is stored in dog_owners db table. 
``` 
