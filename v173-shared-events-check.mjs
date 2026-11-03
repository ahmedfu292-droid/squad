import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const site='site', js=fs.readFileSync(`${site}/v173-shared-events.js`,'utf8'), css=fs.readFileSync(`${site}/v173-shared-events.css`,'utf8');
const html=fs.readFileSync(`${site}/index.html`,'utf8'), sw=fs.readFileSync(`${site}/sw.js`,'utf8');
const rules=fs.readFileSync(`${site}/chanse1/firestore.rules`,'utf8'), deployCopy=fs.readFileSync('FIRESTORE-RULES-v173.rules','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8')), a=JSON.parse(fs.readFileSync(`${site}/version.json`,'utf8')), b=JSON.parse(fs.readFileSync(`${site}/chanse4/version.json`,'utf8'));
assert.match(html,/v173-shared-events\.js/);assert.match(html,/v173-shared-events\.css/);
assert.match(sw,/squad-v187-call-network/);assert.match(sw,/v173-shared-events\.js/);assert.match(sw,/v173-shared-events\.css/);
assert.match(css,/#sq173-events/);assert.equal(pkg.version,'187.0.0');assert.equal(a.build,187);assert.equal(a.version,'v187-call-network');assert.deepEqual(a,b);
const baseRules=rules.replace(/    function validWorldState\(s\) \{[\s\S]*?    \}\n/, '').replace(/    \/\/ v182: private per-account World Systems backup[\s\S]*?    \}\n/, '').replace(/    \/\/ v183: public, sanitized city activity board[\s\S]*?    \}\n/, '').replace(/    \/\/ v185: private account-scoped Universe Suite state[\s\S]*?    \}\n/, '').replace(/\n{3,}/g,'\n\n');
assert.equal(baseRules,deployCopy.replace(/\n{3,}/g,'\n\n'),'v173 rules remain unchanged beneath additive v182/v183/v185 rules');
assert.match(rules,/match \/worldState\/\{ownerUid\}/);assert.match(rules,/match \/worldCommunity\/\{ownerUid\}/);
for(const term of ["match /invitations/{inviteeUid}","resource.data.inviteeUid == request.auth.uid","request.resource.data.status in ['accepted','rejected']","exists(/databases/$(database)/documents/users/$(request.auth.uid)/friends/$(inviteeUid))","getAfter(/databases/$(database)/documents/events/$(eventId)/invitations/$(attendeeUid)).data.status == 'accepted'","request.resource.data.ownerUid == request.auth.uid"]){assert.ok(rules.includes(term),`missing security rule: ${term}`)}
assert.match(js,/collectionGroup\('invitations'\)/);assert.match(js,/where\('inviteeUid','==',u\)/);assert.match(js,/status:'pending'/);assert.match(js,/status:accept\?'accepted':'rejected'/);assert.match(js,/attendees\/\$\{uid\(\)\}/);
assert.match(js,/users\/\$\{u\}\/friends/);assert.match(js,/limit\(60\)/);assert.match(js,/limit\(40\)/);
assert.match(rules,/request\.resource\.data\.eventAt is timestamp/);assert.match(rules,/request\.resource\.data\.title\.size\(\) <= 70/);
assert.doesNotMatch(js,/phone|birthDate|sid|email/i,'event UI must not request private profile identifiers');
new vm.Script(js);console.log('v173 shared events checks passed — UI wiring, Firestore schema, invite/RSVP ownership constraints, release assets.');
