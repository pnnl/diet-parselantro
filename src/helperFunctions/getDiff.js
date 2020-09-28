// DietParselantro Widget

// Copyright (c) 2020, Battelle Memorial Institute
// All rights reserved.

// 1.	Battelle Memorial Institute (hereinafter Battelle) hereby grants permission
// to any person or entity lawfully obtaining a copy of this software and associated 
// documentation files (hereinafter “the Software”) to redistribute and use the 
// Software in source and binary forms, with or without modification.  Such person 
// or entity may use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and may permit others to do so, subject to the following 
// conditions:

// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.

// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.

// * Neither the name of the copyright holder nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.

// 2.	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

function countUniqueChildren(allChange) {
	let allValues = []
	for (let c of Object.keys(allChange)) {
		allValues = allValues.concat(allChange[c].strings)
	}
	allValues = allValues.map(v => v.index)

	return (new Set(allValues)).size
}

// Find differences between data states
export const getDiff = (oldMatches, newMatches, oldRegexDict, newRegexDict, data) => {
	let diffDict = {'deleted': {}, 'added': {}, 'deletedCount': 0, 'addedCount': 0}

	let allInterventions = Object.keys(oldMatches).concat(Object.keys(newMatches))

	for (let r of allInterventions) {
		const oldItems = oldMatches[r]
		const newItems = newMatches[r]

		// If category does not exist in new regexDict
		// Category was deleted
		if (!newItems) {
			diffDict['deleted'][r] = {}
			diffDict['deleted'][r].strings = oldMatches[r]
			diffDict['deleted'][r].oldRegex = oldRegexDict[r]
			diffDict['deleted'][r].newRegex = ''
			diffDict['deletedCount'] = diffDict['deletedCount'] + oldMatches[r].length
		}

		// If category did not exist in old regexDict
		// Category was added
		else if (!oldItems) {
			diffDict['added'][r] = {}
			diffDict['added'][r].strings = newMatches[r]
			diffDict['added'][r].oldRegex = ''
			diffDict['added'][r].newRegex = newRegexDict[r]
			diffDict['addedCount'] = diffDict['addedCount'] + newMatches[r].length
		}

		// If category exists in both old and new regexDicts
		// Check if any items were added/deleted
		else {
			const oldIndices = oldItems.map(i => i.index)
			const newIndices = newItems.map(i => i.index)

			// Compare index of statement
			const deleted = oldItems.filter(i => newIndices.indexOf(i.index) === -1)
			const added = newItems.filter(i => oldIndices.indexOf(i.index) === -1)

			diffDict['deleted'][r] = {}
			diffDict['added'][r] = {}

			diffDict['deleted'][r].strings = deleted
			diffDict['deleted'][r].oldRegex = oldRegexDict[r]
			diffDict['deleted'][r].newRegex = newRegexDict[r]

			diffDict['added'][r].strings = added
			diffDict['added'][r].oldRegex = oldRegexDict[r]
			diffDict['added'][r].newRegex = newRegexDict[r]
		}
	}

	diffDict['deletedCount'] = countUniqueChildren(diffDict['deleted'])
	diffDict['addedCount'] = countUniqueChildren(diffDict['added'])

	return diffDict
}