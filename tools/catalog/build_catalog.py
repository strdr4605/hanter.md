"""Generează src/data/test/catalog.json din tiparele csj918 (csj/) + consumul Hanter.md (models.json)
+ corecturi manuale (overrides.json). Rulare: python3 tools/catalog/build_catalog.py"""
import os; os.chdir(os.path.dirname(os.path.abspath(__file__)))
import json, re
keys = open('csj/keys.txt', encoding='utf-8').read().strip().split(';')
U = open('csj/U.txt', encoding='utf-8').read().rstrip('\n').split('¦')
lines = (open('csj/lines1.txt', encoding='utf-8').read().strip() + '\n' + open('csj/lines2.txt', encoding='utf-8').read().strip()).split('\n')
H = json.load(open('models.json')); mp = json.load(open('map_auto.json'))
mp.update({'Toyota|Land Cruiser Prado 120': 'Toyota|Land Cruiser Prado', 'Toyota|Land Cruiser Prado 150': 'Toyota|Land Cruiser Prado', 'Toyota|Land Cruiser Prado 250': 'Toyota|Land Cruiser Prado'})
HINT = {'Land Cruiser 100': (1998, 2007), 'Land Cruiser 200': (2007, 2021), 'Land Cruiser 300': (2021, 2027), 'Land Cruiser Prado 120': (2002, 2009), 'Land Cruiser Prado 150': (2009, 2023), 'Land Cruiser Prado 250': (2024, 2027)}

def yr(y):
    if not y: return None
    if '~' in y or '-' in y:
        p = re.findall(r'\d{3,4}', y)
        if len(p) == 2:
            a, b = int(p[0]), int(p[1]); a = a if a > 1900 else 2000 + a % 100
            return (a, b)
        return None
    if len(y) == 4:
        a, b = y[:2], y[2:]
        if a == '20': return (int(y), int(y))
        return (2000 + int(a), 2000 + int(b))
    return None

def ylab(r):
    return '' if not r else (str(r[0]) if r[0] == r[1] else f'{r[0]}–{r[1]}')

YFIX = {}
for p_ in open('csj/yfix.txt', encoding='utf-8').read().strip().split(';'):
    c_, _, y_ = p_.partition('='); a_, b_ = y_.split('-'); YFIX[c_.strip()] = (int(a_), int(b_))
def yrc(y, codes):
    for c_ in codes.split('+'):
        if c_.strip() in YFIX: return YFIX[c_.strip()]
    return yr(y)
CODEL = open('csj/codes.txt', encoding='utf-8').read().strip().split('\n')
cat = {}
for ln, cl in zip(lines, CODEL):
    parts = ln.split('|'); k = keys[int(parts[0])]; cparts = cl.split('|')
    out = {}
    for cid, seg, cseg in zip((20, 30, 21), parts[1:4], cparts[1:4]):
        vs, seen = [], set()
        for it, cc in zip([x for x in seg.split(',') if x], [x for x in cseg.split(',') if x]):
            y, _, ds = it.partition('/')
            r = yrc(y, cc); d = [U[int(i)] for i in ds.split('.') if i != '']
            d = [x for x in d if not re.fullmatch(r'\d{4}(–\d{4})?', x)]
            lab = ' · '.join([ylab(r)] + d) if r else (' · '.join(d) or 'variantă unică')
            if lab in seen: continue
            seen.add(lab); vs.append([lab, r[0] if r else 0, r[1] if r else 0])
        vs.sort(key=lambda v: (v[1], v[0]))
        out[cid] = vs
    cat[k] = out

# --- extra sub-brand models (China JV, sport sub-brands, NEV) ---
U2 = open('csj/U2.txt', encoding='utf-8').read().rstrip('\n').split('¦')
NM = {}
for ln in open('csj/names.txt', encoding='utf-8'):
    b, _, r = ln.strip().partition('|')
    for p in r.split(';'):
        i, _, n = p.partition('='); NM[i] = b + '|' + n
L2 = [l for l in (open('csj/L2a.txt', encoding='utf-8').read() + '\n' + open('csj/L2b.txt', encoding='utf-8').read()).split('\n') if l.strip()]
CODES = {}
def lab_of(r, d):
    d = [x for x in d if not re.fullmatch(r'\d{4}(–\d{4})?', x)]
    return ' · '.join([ylab(r)] + d) if r else (' · '.join(d) or 'variantă unică')
for ln in L2:
    p = ln.split('|'); k = NM[p[0]]
    out = cat.setdefault(k, {20: [], 30: [], 21: []})
    for cid, seg in zip((20, 30, 21), p[1:4]):
        seen = set(v[0] for v in out[cid])
        for it in [x for x in seg.split(',') if x]:
            code, y, ix = it.split('/', 2)
            r = yrc(y.strip(), code); d = [U2[int(i)] for i in ix.split('.') if i != '']
            lab = lab_of(r, d)
            CODES.setdefault((k, cid, lab), []).append(code.strip())
            if lab in seen: continue
            seen.add(lab); out[cid].append([lab, r[0] if r else 0, r[1] if r else 0])
        out[cid].sort(key=lambda v: (v[1], v[0]))
# codes for original lines
for ln, cl in zip(lines, open('csj/codes.txt', encoding='utf-8').read().strip().split('\n')):
    p, q = ln.split('|'), cl.split('|'); k = keys[int(p[0])]
    for cid, seg, cseg in zip((20, 30, 21), p[1:4], q[1:4]):
        for it, c in zip([x for x in seg.split(',') if x], [x for x in cseg.split(',') if x]):
            y, _, ds = it.partition('/'); r = yrc(y, c)
            lab = lab_of(r, [U[int(i)] for i in ds.split('.') if i != ''])
            for code in c.split('+'):
                if code.strip(): CODES.setdefault((k, cid, lab), []).append(code.strip())
# modele identice vândute sub Buick în China (Opel / Chevrolet pentru Europa)
for k, cid, lab, a_, b_, code in json.load(open('csj/extra_twins.json', encoding='utf-8')):
    out = cat.setdefault(k, {20: [], 30: [], 21: []})
    if lab not in [v[0] for v in out[cid]]: out[cid].append([lab, a_, b_]); out[cid].sort(key=lambda v: (v[1], v[0]))
    CODES.setdefault((k, cid, lab), []).append(code)
json.dump([[k, c, l, v] for (k, c, l), v in CODES.items()], open('codes_map.json', 'w'), ensure_ascii=False)

def hyr(label, model):
    m = re.search(r'(\d{4})–(\d{4})', label)
    if m: return [int(m.group(1)), int(m.group(2))]
    if model in HINT: return list(HINT[model])
    return None

models = {}
for h in H:
    hk = h['brand'] + '|' + h['model']; ck = mp.get(hk); key = ck or hk
    e = models.setdefault(key, {'b': key.split('|')[0], 'm': key.split('|')[1], 'hv': [], 's20': [], 's30': [], 's21': []})
    if h.get('only'): e['only'] = h['only']
    for v in h['v']:
        hv = {k: v[k] for k in ('cu', 'fara', 'pres', 'jos', 'spatar', 'full', 'n') if k in v}
        hv['okc'] = bool(v.get('okc')); hv['okf'] = bool(v.get('okf')); hv['est'] = v.get('est', [])
        hv['y'] = hyr(v['label'], h['model']); hv['l'] = v['label'] if v['label'] != 'Toate anii' else ''
        if ck and h['model'] != ck.split('|')[1]: hv['l'] = (h['model'] + ' ' + hv['l']).strip()
        e['hv'].append(hv)
for k, v in cat.items():
    e = models.setdefault(k, {'b': k.split('|')[0], 'm': k.split('|')[1], 'hv': [], 's20': [], 's30': [], 's21': []})
    e['s20'], e['s30'], e['s21'] = v[20], v[30], v[21]
L = sorted(models.values(), key=lambda x: (x['b'], x['m']))
OV = json.load(open('overrides.json', encoding='utf-8'))
for m in L:
    for o in OV.get(m['b'] + '|' + m['m'], []):
        if 'vm' in o: m.setdefault('vm', []).append(o['vm']); continue
        for h in m['hv']:
            if o['label'] in (h.get('l') or ''): h.update(o['set'])
json.dump(L, open('../../src/data/test/catalog.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(L), 'models', sum(1 for x in L if x['hv']), 'with Hanter consumption')
