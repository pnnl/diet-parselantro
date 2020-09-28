// DietParselantro Widget

// Copyright (c) 2020, Battelle Memorial Institute
// All rights reserved.

// 1. Battelle Memorial Institute (hereinafter Battelle) hereby grants permission
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

// 2. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import React, {useRef, useEffect, useState} from 'react'

import * as d3 from 'd3'
import d3Tip from "d3-tip"
d3.tip = d3Tip

// Visualize embedding space of text data
export const Embedding = ({visibleRows, selectedRows=[], selectedCategory="", mismatched, toggleMismatched}) => {
  const ref = useRef('embedding')

  const [mismatchedNeighbors, setMismatchedNeighbors] = React.useState([])

  //For now, assume margin is equal all around the graph
  //Do not change these variables anywhere else
  const layout = {"width":300,
                  "height":200,
                  "margin":10}

  const chartWidth = layout.width - layout.margin * 2
  const chartHeight = layout.height - layout.margin * 2

  const selectedIndex = selectedRows.map(s => s.index)

  let header

  if (mismatchedNeighbors.length === 0) {
    header = <p class="overviewStatement">{`no mismatched neighbors`}</p>
  } else {
    header = <p class="overviewStatement" onClick={() => toggleNeighbors()}>{`${mismatched ? "hide" : "show"} mismatched neighbors`}</p>
  }

  const toggleNeighbors = () => {
    if (mismatched) {
      toggleMismatched(false)
    } else {
      toggleMismatched(true)
    }
  }

  // Get mismatched nearest neighbor for each data row
  useEffect(() => {
    let mismatchedOnly = []

    if (["All", "Matched", "Unmatched", ""].indexOf(selectedCategory) > -1) {
      setMismatchedNeighbors(mismatchedOnly)
    }

    for (let s of selectedRows) {
      // If row does not have any nearest neighbors
      if (!s.neighbors) { continue }

      if (!s.matched_spans) { continue }

      // If row is not part of the category (part of subcategory)
      if ((Object.keys(s.matched_spans)).indexOf(selectedCategory) === -1) {
        continue
      }

      for (let n of s.neighbors) {
        let target = visibleRows[n.target]

        // If nearest neighbor has been removed from dataset, continue
        if (!target) { continue }

        let targetCategories = target.matched_spans ? Object.keys(target.matched_spans) : []

        if (targetCategories.indexOf(selectedCategory) === -1) {
          mismatchedOnly.push({'source': s, 'target': target})
        }
      }

    }

    setMismatchedNeighbors(mismatchedOnly)
  }, [visibleRows, selectedRows, selectedCategory])

  // If point is not in the currently selected category, lower opacity
  const getOpacity = (d) => {
    if (selectedCategory === "All" || selectedCategory === "") {
      return 0.5
    }

    return selectedIndex.indexOf(d.index) > -1 ? 1 : 0.1
  }

  useEffect(() => {
    const svgElement = d3.select(ref.current)

    const visible = visibleRows.filter(v => v)

    const gElement = svgElement.select("#maing")

    const mismatchedElement = svgElement.select("#mismatchedg")

    const scaleX = d3.scaleLinear()
                     .range([0, chartWidth])
                     .domain(d3.extent(visible, d => d.coords.x))

    const scaleY = d3.scaleLinear()
                     .range([chartHeight, 0])
                     .domain(d3.extent(visible, d => d.coords.y))

    const circleElements = gElement
      .selectAll(".circle")
      .data(visible)
      .join("circle")
      .attr("class", "circle")
      .attr("cx", d => scaleX(d.coords.x))
      .attr("cy", d => scaleY(d.coords.y))
      .attr("r", 2)
      .attr("fill", d => d.matched_spans ? "#8cb2d1" : "#c0c0c0")
      .attr("opacity", d => getOpacity(d))

    const mismatchedElements = gElement
      .selectAll(".mismatched")
      .data(mismatchedNeighbors)
      .join("circle")
      .attr("class", "mismatched")
      .attr("cx", d => scaleX(d.target.coords.x))
      .attr("cy", d => scaleY(d.target.coords.y))
      .attr("r", 2)
      .attr("fill", "#ff7a7a")
      .attr("visibility", d => mismatched ? "visible" : "hidden")

    const lineElements = mismatchedElement
      .selectAll(".line")
      .data(mismatchedNeighbors)
      .join("line")
      .attr("class", "line")
      .attr("x1", d => scaleX(d.source.coords.x))
      .attr("y1", d => scaleY(d.source.coords.y))
      .attr("x2", d => scaleX(d.target.coords.x))
      .attr("y2", d => scaleY(d.target.coords.y))
      .attr("visibility", d => mismatched ? "visible" : "hidden")
      .attr("stroke", "#ff7a7a")
      .attr("stroke-width", 0.5)

  }, [visibleRows, selectedRows, mismatched])
  
  return <div class="embeddingChart">
    {header}
    <svg width={layout.width} height={layout.height} ref={ref}>
      <g id="mismatchedg"
         width={chartWidth}
         height={chartHeight}
         transform={`translate(${layout.margin}, ${layout.margin})`} />
      <g id="maing"
         width={chartWidth}
         height={chartHeight}
         transform={`translate(${layout.margin}, ${layout.margin})`} />
      
    </svg>
  </div>
}