(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory)
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        factory(exports)
    } else {
        factory(root.jusfD3Tree = root.jusfD3Tree || {})
    }
})(
    typeof window !== 'undefined' ? window : this, function (exports) {
        "use strict";
        function CollapsibleTree(elt) {
            let container = document.getElementById(elt)
            container.innerHTML = ''
            let cWidth = container.offsetWidth
            let cHeight = container.offsetHeight
            // let m = [20, 60, 20, 60]
            let w = cWidth
            let h = cHeight
            let index = 0
            let root = {}
            let root2 = {}

            let tree = d3.layout.tree().size([h, w])

            let parentdiagonal = d3.svg.diagonal().projection(function (d) {
                return [-d.y, d.x]
            })

            let childdiagonal = d3.svg.diagonal().projection(function (d) {
                return [d.y, d.x]
            })

            let vis = d3
                .select('#' + elt)
                .append('svg:svg')
                .attr('width', w)
                .attr('height', h)

            let defs = vis.append('defs');
            vis.selectAll('radialGradient').remove();

            let colors = [{start: '#ff6c00', end: '#ffb400'}, {start: '#3794ff', end: '#71b3ff'}]
            for (let idx = 0; idx < colors.length; idx++) {
                let radialGradient = defs.append('radialGradient')
                    .attr('id', 'MyGradient_color' + (idx + 1));
                radialGradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', colors[idx].start);
                radialGradient.append('stop')
                    .attr('offset', '80%')
                    .attr('stop-color', colors[idx].end);
                radialGradient.append('stop')
                    .attr('offset', '81%')
                    .attr('stop-color', 'white');
                radialGradient.append('stop')
                    .attr('offset', '92%')
                    .attr('stop-color', 'white');
                radialGradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', colors[idx].end);
            }

            let radialGradient2 = defs.append('radialGradient')
                .attr('id', 'MyPath_color_empty')
            radialGradient2.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', 'white')
            radialGradient2.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', 'white')

            let linearColors = ['rgba(204,219,236,0)', 'rgba(204,219,236,.9)', 'rgba(204,219,236,.2)']
            let stops = [['0', '20%', '80%', '100%'], ['0', '80%', '94%', '100%']]
            stops.map(function (item, index) {
                let linearGradient = defs.append('linearGradient')
                    .attr('id', 'MyPath_color' + (index + 1));
                linearGradient.append('stop')
                    .attr('offset', item[0])
                    .attr('stop-color', linearColors[0]);
                linearGradient.append('stop')
                    .attr('offset', item[1])
                    .attr('stop-color', linearColors[1]);
                linearGradient.append('stop')
                    .attr('offset', item[2])
                    .attr('stop-color', linearColors[2]);
                linearGradient.append('stop')
                    .attr('offset', item[3])
                    .attr('stop-color', linearColors[0]);
            })

            let gContainer = vis.append('svg:g')

            // let zoom = d3.behavior.zoom()
            //   .scaleExtent([0.8, 10])
            //   .on("zoom", zoomed);
            // vis.call(zoom);
            // function zoomed() {
            //   gContainer.transition()
            //     .duration(300)
            //     .attr("transform", "translate(" + d3.event.translate[0] + ',' + d3.event.translate[1] + ")scale(" + d3.event.scale + ")");
            //   // .attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
            // }

            let that = {
                init: function (json) {
                    let that = this
                    // d3.json(url, function (json) {
                    root = json

                    root.x0 = w / 2
                    root.y0 = h / 2

                    // Initialize the display to show a few nodes.
                    root.children.forEach(that.toggleAll)
                    root.parents.forEach(that.toggleAll)
                    that.updateBoth(root)
                    // })
                },
                clickCallback: null,
                updateBoth: function (source) {
                    let duration = (d3.event && d3.event.altKey) ? 5000 : 500

                    // Compute the new tree layout.
                    let nodes = tree.nodes(root).reverse()

                    // Normalize for fixed-depth.
                    nodes.forEach(function (d) {
                        d.y = d.depth * 180
                    })

                    // Update the nodes…
                    let node = gContainer.selectAll('g.node').data(nodes, function (d) {
                        return d.id || (d.id = ++index)
                    })

                    // Enter any new nodes at the parent's previous position.
                    let nodeEnter = node
                        .enter()
                        .append('svg:g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + (source.y0 + w / 2) + ',' + source.x0 + ')'
                        })
                        .on('click', function (d) {
                            if (that.clickCallback) {
                                that.clickCallback(d)
                                return
                            }

                            if (d.depth > 0) {
                                that.toggle(d)
                                that.updateBoth(d)
                            }
                        })

                    nodeEnter
                        .append('svg:circle')
                        .attr('class', function (d) {
                            if (d.depth === 0) {
                                return 'gold no-pointer'
                            } else {
                                return 'no-pointer'
                            }
                        })
                        .attr('r', 1e-6)
                        .style('fill', function (d) {
                            return 'white'
                            // return (d._children || d._parents) ? '#3794ff' : '#71b3ff'
                        })

                    nodeEnter
                        .append('svg:text')
                        .attr('x', function (d) {
                            if (that.isParent(d)) {
                                return -10
                            } else {
                                return d.children || d._children ? -10 : 10
                            }
                        })
                        .attr('y', function (d) {
                            if (d.depth === 0) {
                                return -15
                            }
                        })
                        .attr('dy', '.35em')
                        .attr('text-anchor', function (d) {
                            if (d.depth === 0) {
                                return 'middle'
                            }
                            if (that.isParent(d)) {
                                return 'end'
                            } else {
                                return d.children || d._children ? 'end' : 'start'
                            }
                        })
                        .attr('transform', function (d) {
                            if (d != root) {
                                if (that.isParent(d)) {
                                    // return "rotate(45)";
                                } else {
                                    // return "rotate(45)";
                                }
                            }
                        })
                        .text(function (d) {
                            return d.name
                        })
                        .attr('class', function (d) {
                            if (d.value === undefined || d.value < 1) {
                                return 'gray'
                            }
                        })
                        .style('fill-opacity', 1e-6)

                    // Transition nodes to their new position.
                    let nodeUpdate = node
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            if (that.isParent(d)) {
                                return 'translate(' + (w / 2 - d.y) + ',' + d.x + ')'
                            } else {
                                return 'translate(' + (w / 2 + d.y) + ',' + d.x + ')'
                            }
                        })

                    nodeUpdate
                        .select('circle')
                        .attr('r', 6.5)
                        .style('fill', function (d) {
                            if (d.depth === 0) {
                                return 'url(#MyGradient_color1)'
                            }
                            if (d._parents || d._children) {
                                return 'url(#MyGradient_color2)'
                            }
                            return 'white'
                            // return d._children || d._parents ? '#3794ff' : '#71b3ff'
                        })

                    nodeUpdate.select('text').style('fill-opacity', 1)

                    // Transition exiting nodes to the parent's new position.
                    let nodeExit = node
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            if (that.isParent(d)) {
                                return 'translate(' + (w / 2 - source.y) + ',' + source.x + ')'
                            } else {
                                return 'translate(' + (w / 2 + source.y) + ',' + source.x + ')'
                            }
                        })
                        .remove()

                    nodeExit.select('circle').attr('r', 1e-6)

                    nodeExit.select('text').style('fill-opacity', 1e-6)

                    // Update the links…
                    let link = gContainer
                        .selectAll('path.link')
                        .data(tree.links_parents(nodes).concat(tree.links(nodes)), function (d) {
                            return d.target.id
                        })

                    // Enter any new links at the parent's previous position.
                    link
                        .enter()
                        .insert('svg:path', 'g')
                        .attr('class', function (d) {
                            if (d.target.x === d.source.x) {
                                return 'link line'
                            }
                            if (that.isParent(d.target)) {
                                return 'link up'
                            }

                            return 'link'
                        })
                        .transition()
                        .duration(duration)
                        .attr('d', function (d) {
                            return that.getRightPath(d)
                        })

                    // Transition links to their new position.
                    link
                        .transition()
                        .duration(duration)
                        .attr('d', function (d) {
                            return that.getRightPath(d)
                        })

                    // Transition exiting nodes to the parent's new position.
                    link
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('d', function (d) {
                                return that.getRightPath(d, true)
                            }
                        )
                        .remove()

// Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x
                        d.y0 = d.y
                    })
                },
                updateParents: function (source) {
                    let duration = d3.event && d3.event.altKey ? 5000 : 500

                    // Compute the new tree layout.
                    let nodes = tree.nodes(root).reverse()

                    // Normalize for fixed-depth.
                    nodes.forEach(function (d) {
                        d.y = d.depth * 180
                    })

                    // Update the nodes…
                    let node = gContainer.selectAll('g.node').data(nodes, function (d) {
                        return d.id || (d.id = ++i)
                    })

                    // Enter any new nodes at the parent's previous position.
                    let nodeEnter = node
                        .enter()
                        .append('svg:g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + source.x0 + ',' + source.y0 + ')'
                        })
                        .on('click', function (d) {
                            that.toggle(d)
                            that.updateParents(d)
                        })

                    nodeEnter
                        .append('svg:circle')
                        .attr('r', 1e-6)
                        .attr('fill', function (d) {
                            return 'white'
                            // return d._children ? '#3794ff' : '#71b3ff'
                        })

                    nodeEnter
                        .append('svg:text')
                        .attr('x', function (d) {
                            return d.children || d._children ? -10 : 10
                        })
                        .attr('dy', '.35em')
                        .attr('text-anchor', function (d) {
                            return d.children || d._children ? 'end' : 'start'
                        })
                        .text(function (d) {
                            return d.name
                        })
                        .style('fill-opacity', 1e-6)

                    // Transition nodes to their new position.
                    let nodeUpdate = node
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + d.x + ',' + -d.y + ')'
                        })

                    nodeUpdate
                        .select('circle')
                        .attr('r', 6.5)
                        .style('fill', function (d) {
                            return 'white'
                            // return d._children ? '#3794ff' : '#71b3ff'
                        })

                    nodeUpdate.select('text').style('fill-opacity', 1)

                    // Transition exiting nodes to the parent's new position.
                    let nodeExit = node
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + source.x + ',' + source.y + ')'
                        })
                        .remove()

                    nodeExit.select('circle').attr('r', 1e-6)

                    nodeExit.select('text').style('fill-opacity', 1e-6)

                    // Update the links…
                    let link = gContainer
                        .selectAll('path.link')
                        .data(tree.links(nodes), function (d) {
                            return d.target.id
                        })

                    // Enter any new links at the parent's previous position.
                    link
                        .enter()
                        .insert('svg:path', 'g')
                        .attr('class', 'link')
                        .attr('d', function (d) {
                            let o = {x: source.x0, y: source.y0}
                            return parentdiagonal({source: o, target: o})
                        })
                        .transition()
                        .duration(duration)
                        .attr('d', parentdiagonal)

                    // Transition links to their new position.
                    link
                        .transition()
                        .duration(duration)
                        .attr('d', parentdiagonal)

                    // Transition exiting nodes to the parent's new position.
                    link
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('d', function (d) {
                            let o = {x: source.x, y: source.y}
                            return parentdiagonal({source: o, target: o})
                        })
                        .remove()

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x
                        d.y0 = d.y
                    })
                },
                updateChildren: function (source) {
                    let duration = (d3.event && d3.event.altKey) ? 5000 : 500

                    // Compute the new tree layout.
                    let nodes = tree.nodes(root2).reverse()

                    // Normalize for fixed-depth.
                    nodes.forEach(function (d) {
                        d.y = d.depth * 180
                    })

                    // Update the nodes…
                    let node = gContainer.selectAll('g.node').data(nodes, function (d) {
                        return d.id || (d.id = ++i)
                    })

                    // Enter any new nodes at the parent's previous position.
                    let nodeEnter = node
                        .enter()
                        .append('svg:g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + source.x0 + ',' + source.y0 + ')'
                        })
                        .on('click', function (d) {
                            that.toggle(d)
                            that.updateChildren(d)
                        })

                    nodeEnter
                        .append('svg:circle')
                        .attr('r', 1e-6)
                        .style('fill', function (d) {
                            return d._children ? '#3794ff' : '#71b3ff'
                        })

                    nodeEnter
                        .append('svg:text')
                        .attr('x', function (d) {
                            return d.children || d._children ? -10 : 10
                        })
                        .attr('dy', '.35em')
                        .attr('text-anchor', function (d) {
                            return d.children || d._children ? 'end' : 'start'
                        })
                        .text(function (d) {
                            return d.name
                        })
                        .style('fill-opacity', 1e-6)

                    // Transition nodes to their new position.
                    let nodeUpdate = node
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + d.x + ',' + d.y + ')'
                        })

                    nodeUpdate
                        .select('circle')
                        .attr('r', 6.5)
                        .style('fill', function (d) {
                            return 'white'
                            // return d._children ? '#3794ff' : '#71b3ff'
                        })

                    nodeUpdate.select('text').style('fill-opacity', 1)

                    // Transition exiting nodes to the parent's new position.
                    let nodeExit = node
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + source.x + ',' + source.y + ')'
                        })
                        .remove()

                    nodeExit.select('circle').attr('r', 1e-6)

                    nodeExit.select('text').style('fill-opacity', 1e-6)

                    // Update the links…
                    let link = gContainer
                        .selectAll('path.link')
                        .data(tree.links(nodes), function (d) {
                            return d.target.id
                        })

                    // Enter any new links at the parent's previous position.
                    link
                        .enter()
                        .insert('svg:path', 'g')
                        .attr('class', 'link')
                        .attr('d', function (d) {
                            let o = {x: source.x0, y: source.y0}
                            return childdiagonal({source: o, target: o})
                        })
                        .transition()
                        .duration(duration)
                        .attr('d', childdiagonal)

                    // Transition links to their new position.
                    link
                        .transition()
                        .duration(duration)
                        .attr('d', childdiagonal)

                    // Transition exiting nodes to the parent's new position.
                    link
                        .exit()
                        .transition()
                        .duration(duration)
                        .attr('d', function (d) {
                            let o = {x: source.x, y: source.y}
                            return childdiagonal({source: o, target: o})
                        })
                        .remove()

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x
                        d.y0 = d.y
                    })
                }
                ,

                isParent: function (node) {
                    if (node.parent && node.parent != root) {
                        return this.isParent(node.parent)
                    }
                    // if ( node.name == 'data' || node.name == 'scale' || node.name == 'util' ) {
                    else if (node.isparent) {
                        return true
                    } else {
                        return false
                    }
                }
                ,

// Toggle children.
                toggle: function (d) {
                    if (d.children) {
                        d._children = d.children
                        d.children = null
                    } else {
                        d.children = d._children
                        d._children = null
                    }
                    if (d.parents) {
                        d._parents = d.parents
                        d.parents = null
                    } else {
                        d.parents = d._parents
                        d._parents = null
                    }
                }
                ,
                toggleAll: function (d) {
                    if (d.children) {
                        d.children.forEach(that.toggleAll)
                        that.toggle(d)
                    }
                    if (d.parents) {
                        d.parents.forEach(that.toggleAll)
                        that.toggle(d)
                    }
                },
                getRightPath: function (d, isRemoveT, flagT) {
                    let isRemove = isRemoveT ? true : false
                    let flag = flagT ? flagT : 'target'

                    let source = {}
                    let target = {}

                    if (that.isParent(d.target)) {
                        source = getRightPos(d.target)
                        target = getRightPos(d.source)
                    } else {
                        source = getRightPos(d.source)
                        target = getRightPos(d.target)
                    }

                    function getRightPos(d) {
                        if (that.isParent(d)) {
                            return {y: w / 2 - d.y, x: d.x, name: d.name}
                        } else {
                            return {y: w / 2 + d.y, x: d.x, name: d.name}
                        }
                    }

                    let middle = {x: 0, y: 0}
                    middle.x = (source.x + target.x) / 2
                    middle.y = (source.y + target.y) / 2
                    if (isRemove) {
                        if (that.isParent(d[flag])) {
                            source = middle
                        } else {
                            target = middle
                        }
                    }

                    return (
                        'M' +
                        source.y +
                        ',' +
                        source.x +
                        'C' +
                        (source.y + target.y) / 2 +
                        ',' +
                        source.x +
                        ' ' +
                        (source.y + target.y) / 2 +
                        ',' +
                        target.x +
                        ' ' +
                        target.y +
                        ',' +
                        target.x
                    )
                }
            }

            return that
        }


        exports.version = '1.0.0'
        exports.CollapsibleTree = {drawTree: CollapsibleTree}
    }
)
