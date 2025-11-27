
import { isEqual, cloneDeep } from 'lodash';

const VARIABLES = new Set(['x', 'y', 'z', 'u', 'v', 'w', 'p', 's']);

function isVariable(term: any): term is string {
    return typeof term === 'string' && VARIABLES.has(term);
}

export class Literal {
    name: string;
    args: any[];
    negated: boolean;

    constructor(name: string, args: any[] = [], negated = false) {
        this.name = name;
        this.args = args;
        this.negated = negated;
    }

    toString(): string {
        const prefix = this.negated ? "¬" : "";
        if (this.args.length > 0) {
            return `${prefix}${this.name}(${this.args.map(String).join(', ')})`;
        }
        return `${prefix}${this.name}`;
    }

    negate(): Literal {
        return new Literal(this.name, this.args, !this.negated);
    }

    applySubst(subst: Substitution): Literal {
        const newArgs = this.args.map(arg => {
            let current = arg;
            while (subst[current]) {
                current = subst[current];
            }
            return current;
        });
        return new Literal(this.name, newArgs, this.negated);
    }
}

type Substitution = { [key: string]: any };

function splitClauses(inputStr: string): string[] {
    const clauses: string[] = [];
    let depth = 0;
    let current = '';
    for (const ch of inputStr) {
        if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
        } else if (ch === ',' && depth === 0) {
            clauses.push(current.trim());
            current = '';
            continue;
        }
        current += ch;
    }
    if (current) {
        clauses.push(current.trim());
    }
    return clauses;
}

function splitLiterals(clauseStr: string): string[] {
    const literals: string[] = [];
    let depth = 0;
    let current = '';
    for (const ch of clauseStr) {
        if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
        } else if (ch === 'V' && depth === 0) {
            literals.push(current.trim());
            current = '';
            continue;
        }
        current += ch;
    }
    if (current) {
        literals.push(current.trim());
    }
    return literals;
}

function parseLiteral(s: string): Literal {
    s = s.trim();
    const neg = s.startsWith('¬');
    if (neg) {
        s = s.substring(1).trim();
    }

    const match = s.match(/^([^\(\s]+)\s*(?:\((.*)\))?$/);
    if (!match) {
        throw new Error(`Cannot parse literal: ${s}`);
    }
    const name = match[1];
    const argsStr = match[2];
    const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];

    return new Literal(name, args, neg);
}

function parseClause(s: string): Literal[] {
    return splitLiterals(s).map(parseLiteral);
}

function unify(x: any, y: any, subst: Substitution = {}): Substitution | null {
    if (isEqual(x, y)) {
        return subst;
    }
    if (isVariable(x)) {
        subst[x] = y;
        return subst;
    }
    if (isVariable(y)) {
        return unify(y, x, subst);
    }
    if (typeof x === 'string' && typeof y === 'string') {
        return null;
    }
    if (x instanceof Literal && y instanceof Literal) {
        if (x.name !== y.name || x.args.length !== y.args.length) {
            return null;
        }
        for (let i = 0; i < x.args.length; i++) {
            const unified = unify(x.args[i], y.args[i], subst);
            if (unified === null) {
                return null;
            }
            subst = unified;
        }
        return subst;
    }
    return null;
}

function applySubstClause(clause: Literal[], subst: Substitution): Literal[] {
    return clause.map(lit => lit.applySubst(subst));
}

function isEmptyClause(clause: Literal[]): boolean {
    return clause.length === 0;
}

function formatClause(clause: Literal[]): string {
    if (!clause || clause.length === 0) {
        return "□";
    }
    return clause.map(String).join(" V ");
}

export function resolution(clauses: Literal[][]): { S: Literal[][], derivation: any[] } {
    let S = cloneDeep(clauses);
    const derivation: any[] = [];
    const pairsChecked = new Set<string>();

    while (true) {
        const newResolvents: Literal[][] = [];
        for (let i = 0; i < S.length; i++) {
            for (let j = i + 1; j < S.length; j++) {
                const pairKey = `${i}-${j}`;
                if (pairsChecked.has(pairKey)) continue;
                pairsChecked.add(pairKey);

                for (const li of S[i]) {
                    for (const lj of S[j]) {
                        if (li.name === lj.name && li.negated !== lj.negated) {
                            const subst = unify(li, lj.negate());
                            if (subst !== null) {
                                let ci = applySubstClause(S[i], subst);
                                let cj = applySubstClause(S[j], subst);

                                const liSub = li.applySubst(subst);
                                const ljSub = lj.applySubst(subst);

                                ci = ci.filter(l => !isEqual(l, liSub));
                                cj = cj.filter(l => !isEqual(l, ljSub));

                                const rawResolvent = [...ci, ...cj];

                                const seenLiterals = new Set<string>();
                                const resolvent = rawResolvent.filter(lit => {
                                    const litStr = lit.toString();
                                    if (!seenLiterals.has(litStr)) {
                                        seenLiterals.add(litStr);
                                        return true;
                                    }
                                    return false;
                                });

                                let isTautology = false;
                                for (const lit of resolvent) {
                                    if (resolvent.some(other => isEqual(other, lit.negate()))) {
                                        isTautology = true;
                                        break;
                                    }
                                }
                                if (isTautology) continue;

                                const isDuplicate = (S.concat(newResolvents)).some(existing =>
                                    existing.length === resolvent.length &&
                                    resolvent.every(l => existing.some(el => isEqual(el, l)))
                                );

                                if (!isDuplicate) {
                                    derivation.push({
                                        resolvent: resolvent,
                                        parents: [i + 1, j + 1],
                                        literals: [li, lj],
                                        subst: subst
                                    });

                                    if (isEmptyClause(resolvent)) {
                                        S.push(...newResolvents);
                                        return { S: [...S, resolvent], derivation };
                                    }
                                    newResolvents.push(resolvent);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (newResolvents.length === 0) break;
        S.push(...newResolvents);
    }
    return { S, derivation };
}

function filterDerivation(derivation: any[], numInputClauses: number, emptyClauseIdx: number) {
    const needed = new Set<number>();
    for (let i = 1; i <= numInputClauses; i++) {
        needed.add(i);
    }

    const markNeeded = (idx: number) => {
        if (needed.has(idx)) return;
        needed.add(idx);
        const relIdx = idx - (numInputClauses + 1);
        if (relIdx >= 0 && relIdx < derivation.length) {
            const [p1, p2] = derivation[relIdx].parents;
            markNeeded(p1);
            markNeeded(p2);
        }
    };

    markNeeded(emptyClauseIdx);

    const neededArray = Array.from(needed).sort((a,b) => a-b);

    const filtered = derivation
        .map((d, i) => ({...d, originalIndex: i + numInputClauses + 1}))
        .filter(d => needed.has(d.originalIndex));

    const mapping: {[key: number]: number} = {};
    neededArray.forEach((val, i) => {
        mapping[val] = i + 1;
    });

    return filtered.map(d => {
        const [p1, p2] = d.parents;
        return {
            ...d,
            parents: [mapping[p1], mapping[p2]]
        };
    });
}

export function main(inputStr: string, fullLog = false): string {
    const clauses = splitClauses(inputStr).map(parseClause);
    const { S: S0, derivation } = resolution(clauses);
    let output = "";

    let emptyIdx: number | null = null;
    for (let i = 0; i < S0.length; i++) {
        if (isEmptyClause(S0[i])) {
            emptyIdx = i + 1;
            break;
        }
    }

    if (derivation.length === 0 || !isEmptyClause(derivation[derivation.length-1].resolvent)) {
        fullLog = true;
    }

    let filteredDerivation: any[] = [];
    output += "=== Множество дизъюнктов (S0) ===\n";
    clauses.forEach((c, i) => {
        output += `${i + 1}. ${formatClause(c)}\n`;
    });

    output += "\n=== 2. Вывод ===\n";

    if (fullLog) {
        derivation.forEach((d, i) => {
            output += `${i + clauses.length + 1}. ${formatClause(d.resolvent)}\n`;
            output += `   - Родители: ${d.parents[0]} и ${d.parents[1]}\n`;
            output += `   - Литеры: ${d.literals[0].toString()} и ${d.literals[1].toString()}\n`;
            output += `   - Унификатор σ: ${JSON.stringify(d.subst)}\n`;
        });
        if (derivation.length > 0 && isEmptyClause(derivation[derivation.length -1].resolvent)) {
            output += "\n ====== Короткий вывод =====\n\n";
        }
    }

    if (emptyIdx) {
        filteredDerivation = filterDerivation(derivation, clauses.length, emptyIdx);
    }

    filteredDerivation.forEach((d, i) => {
        output += `${i + clauses.length + 1}. ${formatClause(d.resolvent)}\n`;
        output += `   - Родители: ${d.parents[0]} и ${d.parents[1]}\n`;
        output += `   - Литеры: ${d.literals[0].toString()} и ${d.literals[1].toString()}\n`;
        output += `   - Унификатор σ: ${JSON.stringify(d.subst)}\n`;
    });

    output += "\n=== 3. Результат ===\n";
    if (derivation.length === 0 || !isEmptyClause(derivation[derivation.length-1].resolvent)) {
        output += "Не доказано: Резольвенты исчерпаны, пустой дизъюнкт не получен.";
    } else {
        output += "Выражение доказано. Получен пустой дизъюнкт";
    }

    return output;
}
