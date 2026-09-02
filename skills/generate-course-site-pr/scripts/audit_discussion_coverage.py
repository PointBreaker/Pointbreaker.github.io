#!/usr/bin/env python3
"""Audit CourseStack Discussions for exact ID coverage and anti-outline evidence."""

from __future__ import annotations
import argparse, json, re, sys
from html.parser import HTMLParser
from pathlib import Path

ALLOWED = {"OUTLINE_ONLY", "PARTIAL", "DIGESTED", "GOLD"}
LOOP = {"problem-setup", "prediction", "work-it-out", "reveal", "why-this-works", "wrong-turn", "variation"}

class Scan(HTMLParser):
    def __init__(self):
        super().__init__(); self.body={}; self.activities=[]; self.stack=[]; self.classes={}; self.quiz=[]
    def handle_starttag(self, tag, attrs_list):
        attrs={k:v or "" for k,v in attrs_list}; classes=set(attrs.get("class","").split())
        if tag=="body": self.body=attrs
        for c in classes: self.classes[c]=self.classes.get(c,0)+1
        if "data-quiz" in attrs: self.quiz.append(attrs["data-quiz"])
        activity=None
        if "guided-problem" in classes:
            activity={"ids":attrs.get("data-official-ids","").split(),"parts":set()}; self.activities.append(activity)
        elif self.stack: activity=self.stack[-1]
        if activity: activity["parts"].update(classes & LOOP)
        self.stack.append(activity)
    def handle_endtag(self, tag):
        if self.stack: self.stack.pop()

def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument("--repo",required=True); ap.add_argument("--slug",required=True); ap.add_argument("--json",action="store_true"); a=ap.parse_args()
    repo=Path(a.repo).resolve(); course=repo/"courses"/a.slug; info=json.loads((course/"course-info.json").read_text())
    contract=info.get("qualityContract",{}).get("discussionCoverage",{}); errors=[]; rows=[]
    for number, expected in sorted(contract.items(), key=lambda x:int(x[0])):
        matches=list((course/"lessons/assignments").glob(f"ass{int(number):02d}-discussion-*.html"))
        if len(matches)!=1: errors.append(f"D{number}: expected one page, found {len(matches)}"); continue
        scan=Scan(); scan.feed(matches[0].read_text(encoding="utf-8",errors="replace")); status=scan.body.get("data-discussion-status","UNDECLARED")
        covered={i for act in scan.activities for i in act["ids"]}; expected_set=set(expected); missing=sorted(expected_set-covered); extra=sorted(covered-expected_set)
        incomplete=[" ".join(act["ids"]) for act in scan.activities if not LOOP.issubset(act["parts"])]
        row={"discussion":int(number),"file":matches[0].relative_to(repo).as_posix(),"status":status,"expected":len(expected_set),"covered":len(expected_set & covered),"missing":missing,"extra":extra,"activities":len(scan.activities),"incompleteLoops":incomplete,"quizCount":len(scan.quiz)}; rows.append(row)
        if status not in ALLOWED: errors.append(f"D{number}: invalid status {status}")
        if missing or extra: errors.append(f"D{number}: coverage mismatch missing={missing} extra={extra}")
        if incomplete: errors.append(f"D{number}: incomplete guided loops {incomplete}")
        if status in {"DIGESTED","GOLD"} and len(scan.activities)<2: errors.append(f"D{number}: This is an index, not a digested workbook.")
        if status=="GOLD":
            for cls in ("interactive-trace","misconception-analysis","closed-book-reconstruction"):
                if not scan.classes.get(cls): errors.append(f"D{number}: Gold evidence missing {cls}")
            if len(scan.quiz)<4: errors.append(f"D{number}: Gold has only {len(scan.quiz)} diagnostic checks")
    payload={"slug":a.slug,"discussions":rows,"errors":errors,"note":"Structural coverage only; FULL/DIGESTED still requires source-level human review."}
    print(json.dumps(payload,ensure_ascii=False,indent=2) if a.json else "\n".join([f"D{x['discussion']:02d} {x['status']:<12} official={x['expected']} covered={x['covered']} activities={x['activities']} quizzes={x['quizCount']}" for x in rows]+[*(f"ERROR: {e}" for e in errors),payload["note"]]))
    return 1 if errors else 0
if __name__=="__main__": raise SystemExit(main())
