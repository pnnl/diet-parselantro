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

import { getMatches } from './getMatches'

// For each category, insert it into the category tree
function insert(nodes, currentNode, value) {
	let currentChildren = currentNode['children']

	if (nodes.length === 1) {
		currentChildren.push({'name': nodes[0], 'value': value, 'children': []})
		return currentNode
	}

	let nodeName = nodes[0]

	for (let i = 0; i < currentChildren.length; i++) {
		let c = currentChildren[i]
		if (c.name === nodeName) {
			currentChildren.splice(i, 1, insert(nodes.slice(1), c, value))
			return currentNode
		}
	}
	currentChildren.push(insert(nodes.slice(1), {'name': nodeName, 'children':[]}, value))
	return currentNode
}

// Create a category hierarchy for d3
export const nestData = (data, matchedCategory) => {
	let allMatched = []
	let tempResult = {'name':'Matched', 'children':[]}

	let categoryNames = Object.keys(matchedCategory).sort()

	// Get matched statements for each category
	// Then insert into tree hierarchy
	for (let r of categoryNames) {
		let matches = matchedCategory[r]

		allMatched = allMatched.concat(matches.map(d => d['clean_text']))

		let nodes = r.split('.')
		let currentNode = tempResult

		tempResult = insert(nodes, tempResult, matches)
	}

	allMatched = new Set(allMatched)

	let unmatched = data.filter(d => {
		if (!d) { return false }
		return !(allMatched.has(d['clean_text']))
	})

	return {'name':'All', 'children': [tempResult, {'name':'Unmatched', 'value':unmatched}]}
}
