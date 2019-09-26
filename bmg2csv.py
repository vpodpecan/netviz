import io
import sys
import networkx as nx

OPTLINE = '#'
CANVAS = '_canvas'
ATTRS = '_attributes'
DB = '_database'
SYMMETRIC = '_symmetric'

ARCREL = 'relation'
LINECOLOR = 'linecolor'
FILL = 'fill'
ISSOURCE = 'is_source_node'
SYMMETRIC_EDGE_TYPES = ['interacts_with', 'is_homologous_to', 'is_related_to', 'functionally_associated_to']


def load_BMG_to_networkx(data):
    fp = io.StringIO()
    fp.write(data)
    fp.flush()
    fp.seek(0)

    lines = fp.readlines()
    fp.close()

    graph = nx.MultiDiGraph()
    sourceNodes = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        elts = line.split(' ') # this is important to retain strange unicode spaces

        if elts[0] == OPTLINE:
            if elts[1] == ATTRS:
                node = elts[2]
                attrs = elts[3:]
                if not graph.has_node(node):
                    # this is a special case: no connections, no found nodes, only query nodes
                    graph.add_node(node)

                for atr in attrs:
                    parts = atr.split('=')
                    graph.node[node][parts[0]] = parts[1].replace('+', ' ')

                if node in sourceNodes:
                    graph.node[node][ISSOURCE] = str(True)
            else:
                # unused tags:  DB, CANVAS, SYMMETRIC
                continue
        # edge data
        else:
            # lines with node announcements (source nodes)
            if len(elts) == 1:
                snode = elts[0]
                sourceNodes.append(snode)
#                if not graph.has_node(snode):
#                    graph.add_node(snode)
            elif len(elts) == 2:
                continue # such cases should not be present
            else:
                n1 = elts[0]
                n2 = elts[1]
                rel = elts[2]
                attrs = elts[3:]

                if not graph.has_node(n1):
                    graph.add_node(n1)
                if not graph.has_node(n2):
                    graph.add_node(n2)

                atrDict = {}
                for atr in attrs:
                    parts = atr.split('=')
                    atrDict[parts[0]] = parts[1].replace('+', ' ')
                    # graph[n1][n2][parts[0]] = parts[1]

                # careful: some symmetric relations may be explicitly declared as not such...
                if 'symmetric' in atrDict:
                    symmetric = eval(atrDict['symmetric'])
                else:
                    symmetric = True if rel.replace('-', '') in SYMMETRIC_EDGE_TYPES else False
                atrDict['symmetric'] = str(symmetric)

                # NetworkX does not support mixed graphs
                # is it ok if we add both links? probably not...
                if rel.startswith('-'):
                    # handle also the reverse case
                    rel = rel[1:]
                    graph.add_edge(n2, n1, key=rel, attr_dict=atrDict)
                    # if atrDict['symmetric']:
                    #     graph.add_edge(n1, n2, key=rel, attr_dict=atrDict)
                else:
                    graph.add_edge(n1, n2, key=rel, attr_dict=atrDict)
                    # if atrDict['symmetric']:
                    #     graph.add_edge(n2, n1, key=rel, attr_dict=atrDict)

    return graph
# end


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: bmg2csv.py <.bmg file>')
        exit(1)

    s = open(sys.argv[1]).read()
    n = load_BMG_to_networkx(s)

    for fr, to, key in n.edges:
        sent = n[fr][to][key]['attr_dict']['sentence']
        sent = sent.replace('_', ' ').replace('\n', ' ')
        if ',' in sent:
            sent = '"{}"'.format(sent)
        if ',' in fr:
            fr = '"{}"'.format(fr)
        if ',' in to:
            to = '"{}"'.format(to)
        print('{},{},->,,{}'.format(fr, to, sent))
