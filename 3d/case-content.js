// Authored scenario details build on the existing, future-applicability legal explanations.
export const dossiers={
 toggle:{time:'01:17',hook:'Someone switched on the location stream. Nobody remembers agreeing.',beats:['A release candidate is already collecting coordinates.','The permission screen appears after the first upload.','Trace the switch before the rollout reaches everyone.'],clues:[['Device log','The first location upload precedes the permission-screen event by 11 seconds.'],['Campaign request','Marketing wants to reuse class-alert phone numbers for a premium-membership campaign.'],['Partner mock-up','Safety alerts and partner promotions share a single checkbox.']]},
 permission:{time:'01:42',hook:'She withdrew permission. The campaign kept following her.',beats:['Mira turned personalized offers off.','The next export still contains her account ID.','Find where her choice disappeared.'],clues:[['Preference receipt','Mira opted out of offers, not out of her core account service.'],['Click-path recording','Permission took one tap. Withdrawal takes nine screens and a support request.'],['Dashboard proposal','A proposed cross-service consent tool also wants to profile its users for advertising.']]},
 'city-form':{time:'02:03',hook:'One grant application. An entire life attached.',beats:['The portal wants more than proof of eligibility.','A broad records request arrives without a named function.','Separate a lawful need from a growing appetite.'],clues:[['Form schema','The grant form includes eligibility records, contacts and browsing history.'],['Launch brief','The only reason recorded for the extra fields is possible future departmental use.'],['Official request','The requesting office cites government status but does not identify the legal function or needed records.']]},
 schoolyard:{time:'02:09',hook:'The game is free. The children are being watched.',beats:['A learning app sends a new stream of behavioral events.','A sixteen-year-old has accepted the terms alone.','Find the boundary before the next lesson starts.'],clues:[['Ad-module trace','The module records pauses, replays and abandoned lessons to profile children for ads.'],['Account record','Age is listed as sixteen. There is no verified parent or guardian consent record and no exemption is documented.'],['Support recording','A guardian cannot operate the rights-request form using a keyboard or assistive technology.']]},
 vendor:{time:'02:14',hook:'The vendor needs a copy. Then its vendor needs another.',beats:['Appointment reminders became a request for research data.','An unreviewed subcontractor is waiting for access.','Follow the chain before responsibility disappears.'],clues:[['Sales email','The reminder vendor requests a separate copy for its own product research.'],['Access ticket','The subcontractor would see identifiable customer events; its access is not covered by the reviewed arrangement.'],['Incident thread','Executives assume the vendor contract transfers the company’s statutory responsibility.']]},
 breach:{time:'02:31',hook:'The drive is still syncing. Every second creates another copy.',beats:['Customer records have left the controlled environment.','The cloud provider offers to handle the notices.','Contain the leak. Do not let silence become the next incident.'],clues:[['Sync status','An employee’s personal drive is still uploading customer records. The copy count is unknown.'],['Provider report','The provider confirms exposed company records but offers no evidence that required notices have been completed.'],['Comms draft','The proposed announcement is on hold until every forensic detail is confirmed.']]},
 'rights-desk':{time:'03:04',hook:'Three requests. No owner. One person locked outside their own data.',beats:['An access request gets a generic policy link.','A verified name correction waits for the annual review.','Find the person behind the ticket number.'],clues:[['Access ticket','The user requests an account-specific summary of processing, not a copy of the general privacy policy.'],['Correction evidence','The request supplies credible evidence of a misspelled name. No verification issue remains.'],['Escalation queue','A deletion request has gone unanswered and no grievance owner is assigned.']]},
 'memory-drawer':{time:'03:27',hook:'The event ended months ago. Its data never left.',beats:['An ownerless bucket still holds attendee profiles.','Another archive is being described as deletion.','Decide what must remain—and what must finally disappear.'],clues:[['Bucket inventory','Extra attendee profiles remain in staging after the event purpose ended; processor copies also exist.'],['Retention review','No law requires retaining these dietary preferences. Separately required processing records must still be assessed.'],['Conflicting records','A lender’s queued decision would use contradictory customer information that has not been reconciled.']]},
 'borderless-copy':{time:'04:02',hook:'A copy crosses a border. A public profile joins the trail.',beats:['A migration ticket assumes every overseas transfer is banned.','Nobody can establish who published the added profile data.','Check the route, the source, and the person accountable.'],clues:[['Migration plan','The destination country, applicable directions and sector-specific restrictions have not yet been checked.'],['Source history','The page is publicly visible, but who posted the personal data and under what obligation is unknown.'],['Help page','Only the cloud provider is listed; there is no business contact able to answer for the service’s processing.']]},
 'audit-trail':{time:'04:41',hook:'A timestamp is not a story. Tonight, the missing pieces matter.',beats:['The notice shown at consent time cannot be found.','A rights request contains someone else’s documents.','Reconstruct the proof before the audit reaches the next account.'],clues:[['Consent export','The export has a timestamp but no linked notice version or record of the affirmative action.'],['Request attachment','The identity documents appear to belong to a different person. They have not been verified.'],['Permission inventory','An intern who needs ticket status can export all customer records. The broad role is still active.']]}
};

// Each distractor includes a plausible control but omits a decisive requirement.
export const closeChoices={
  "notice": [
    [
      "Explain location collection and its purpose, then interpret continued browsing as consent to the location stream.",
      "A notice alone does not establish the required affirmative consent."
    ],
    [
      "Obtain device location permission before collection, then provide the service purpose when users open account settings.",
      "An OS permission does not replace the required purpose-specific notice and consent."
    ],
    [
      "Explain location collection and partner promotions, then require one combined approval before enabling the location stream.",
      "Bundling unrelated uses undermines a specific, informed choice."
    ]
  ],
  "purpose": [
    [
      "Send the new purpose notice before launch, then include customers who leave their existing preferences unchanged.",
      "A new notice and silence do not by themselves supply consent for the new purpose."
    ],
    [
      "Keep the campaign within the company, then use class-alert consent to authorize messages about premium memberships.",
      "Keeping processing in-house does not expand the original purpose."
    ],
    [
      "Approve a restricted partner contract before launch, then use existing class-alert numbers for the promotional campaign.",
      "A processor or partner contract does not establish the required processing basis."
    ]
  ],
  "consentseparate": [
    [
      "Describe each purpose with separate headings, requiring customers to approve safety alerts together with partner promotions.",
      "Clear wording does not fix the absence of a meaningful separate choice."
    ],
    [
      "Describe each purpose with separate controls, enabling both initially and allowing customers to change preferences afterward.",
      "A later opt-out does not replace specific affirmative consent at collection."
    ],
    [
      "Describe each purpose with separate explanations, treating approval of safety alerts as authorization for partner promotions.",
      "Explaining separate purposes does not make consent to one cover the other."
    ]
  ],
  "withdraw": [
    [
      "Stop collecting new offer data through immediate withdrawal, while retaining existing profiles until the campaign expires.",
      "Withdrawal affects the processing for that purpose, not just new collection."
    ],
    [
      "Remove the offer preference immediately, while requiring closure of the core account before stopping offer processing.",
      "Unrelated core processing with its own basis need not end to withdraw an optional purpose."
    ],
    [
      "Keep core services active and stop offer processing once support validates the signed withdrawal form manually.",
      "That route does not provide ease comparable to giving consent."
    ]
  ],
  "noticewithdraw": [
    [
      "Clarify the notice and retain the existing withdrawal sequence, with verification repeated across its nine screens.",
      "Clear notice alone does not correct an unnecessarily difficult withdrawal path."
    ],
    [
      "Clarify the notice and publish a support address, with withdrawal accepted after the existing sequence finishes.",
      "A nominal contact does not make the actual withdrawal route practical."
    ],
    [
      "Clarify the notice and introduce direct withdrawal for subscribers, with other users following the support-assisted route.",
      "The ease of withdrawal should not depend on buying access to the simpler route."
    ]
  ],
  "consentmanager": [
    [
      "Choose an interoperable manager offering accessible, transparent consent controls, completing Board registration after the service launches.",
      "Interoperability alone does not satisfy the Consent Manager registration requirement."
    ],
    [
      "Choose a registered manager offering accessible consent controls, using customer choices to build its advertising profiles.",
      "Registration does not authorize the manager to repurpose consent choices for its own advertising."
    ],
    [
      "Choose a registered manager offering transparent consent controls, limiting customer choices to its own affiliated providers.",
      "A cross-provider consent service must be interoperable, rather than restrict choices to affiliated providers."
    ]
  ],
  "minimum": [
    [
      "Encrypt fields collected beyond eligibility checks, and reserve them for departmental requests after opening the portal.",
      "Security controls do not establish a necessary, specific purpose for extra collection."
    ],
    [
      "Retain mandatory contact uploads alongside eligibility checks, and defer inspection until a departmental need becomes clearer.",
      "Delayed use does not justify collection unrelated to the stated purpose."
    ],
    [
      "Retain browsing history under fraud-prevention consent, and define its specific eligibility role after the application launch.",
      "A vague label does not connect the extra data to a specific present purpose."
    ]
  ],
  "lawfulbasis": [
    [
      "Require a documented future benefit and provisional departmental approval before approving collection of the additional records.",
      "A possible future benefit is not a defined lawful purpose and permitted basis."
    ],
    [
      "Require encryption and restricted departmental access before approving collection, with the processing purpose finalized after launch.",
      "Security approval and lawful processing basis answer different questions."
    ],
    [
      "Require broad applicant agreement to departmental use before approving collection, with specific purposes assigned during review.",
      "The original notice cannot authorize unspecified later departmental purposes."
    ]
  ],
  "legitimate": [
    [
      "Confirm the requesting office and secure transfer route before approving all fields in its authenticated request.",
      "An authentic office may still make an overbroad or unsupported request."
    ],
    [
      "Confirm the sharing agreement and recipient safeguards before treating government status as sufficient grounds for disclosure.",
      "An agreement does not substitute for identifying the applicable statutory ground."
    ],
    [
      "Confirm the original grant consent and requester identity before applying that consent to subsequent departmental requests.",
      "The original purpose does not automatically cover all later requests."
    ]
  ],
  "child": [
    [
      "Verify parental consent before processing, and retain child behavioral profiling within the advertising settings parents approve.",
      "Parental consent does not by itself remove the separate restrictions on profiling children."
    ],
    [
      "Disable targeted advertising before release, and accept the child’s own agreement for the remaining personal-data collection.",
      "Removing ads does not by itself satisfy the parental-consent requirement."
    ],
    [
      "Replace names with persistent identifiers before release, and retain child tracking within the protected advertising module.",
      "Persistent pseudonymous identifiers do not automatically remove the child-data safeguards."
    ]
  ],
  "childconsent": [
    [
      "Record the sixteen-year-old’s declaration of parental approval before enabling processing under the service’s standard consent procedure.",
      "The scenario has no verified parent or guardian consent."
    ],
    [
      "Notify the parent about intended collection before enabling processing, with a subsequent opportunity to object provided.",
      "Notice plus silence does not constitute verifiable parental consent."
    ],
    [
      "Document the educational purpose before enabling processing, treating the learning context as sufficient grounds for exemption.",
      "An exemption must actually apply; the product label is not enough."
    ]
  ],
  "requestchannel": [
    [
      "Provide detailed submission instructions with clear guidance, retaining the existing form as the required completion route.",
      "Describing rights does not make the only usable request channel accessible."
    ],
    [
      "Provide a public support thread with staff assistance, allowing the guardian to submit verification documents there.",
      "Public disclosure is not an appropriate replacement for an accessible rights channel."
    ],
    [
      "Provide private email assistance with form completion, accepting the request once the existing form is submitted.",
      "The added help does not remove the barrier to submitting the request."
    ]
  ],
  "processor": [
    [
      "Require a confidentiality agreement and safeguards for reminders, allowing the research copy within the confidentiality restrictions.",
      "An NDA alone does not authorize unrelated research or cover all processor obligations."
    ],
    [
      "Require a restricted initial transfer and safeguards for reminders, completing the processing contract after access begins.",
      "A limited transfer does not remove the valid-contract requirement."
    ],
    [
      "Require a processing contract and safeguards for reminders, assigning the company’s statutory responsibility exclusively to vendors.",
      "Contract allocation does not extinguish the Data Fiduciary’s responsibility."
    ]
  ],
  "securityvendor": [
    [
      "Approve confidential subcontractor access under an NDA, reviewing contractual coverage after the planned service release completes.",
      "An NDA does not replace the needed purpose, contractual and safeguard review."
    ],
    [
      "Approve subcontractor access following the primary processor’s recommendation, treating its selection as confirmation of authorized processing.",
      "Selection by a processor does not itself establish authorized and safeguarded access."
    ],
    [
      "Approve subcontractor access after hashing customer identifiers, treating pseudonymisation as sufficient grounds to waive further review.",
      "Pseudonymisation does not automatically take identifiable data outside the obligations."
    ]
  ],
  "fiduciary": [
    [
      "The company retains responsibility for incident notices, while the vendor assumes all remaining statutory processing duties.",
      "The Data Fiduciary’s responsibility is not confined to the notices."
    ],
    [
      "The company assumes responsibility after a customer complaint, while the vendor manages compliance until that point.",
      "Responsibility for processing on its behalf does not wait for a complaint."
    ],
    [
      "The company transfers responsibility through the indemnity clause, while the vendor manages compliance for outsourced processing.",
      "An indemnity may allocate costs but does not remove statutory duties."
    ]
  ],
  "security": [
    [
      "Stop the sync, delete the local copy, restore safeguards and close the incident following containment actions.",
      "Containment alone does not establish the extent of exposure or satisfy notification duties."
    ],
    [
      "Secure the account, investigate affected copies, restore safeguards and defer notices until complete forensic findings arrive.",
      "Investigation does not justify delaying required initial notification steps."
    ],
    [
      "Refer containment to the provider, restore account access and accept its standard communications as completing notifications.",
      "The company must ensure its own required response and notifications are fulfilled."
    ]
  ],
  "breach": [
    [
      "Delegate required notices to the provider’s incident team, recording its assurance as completion of notification duties.",
      "Delegation does not discharge responsibility without ensuring the duties are met."
    ],
    [
      "Verify delivery of required Board notices, allowing the provider to decide whether affected people need notification.",
      "Affected Data Principals also have prescribed notification rights."
    ],
    [
      "Verify restoration of the provider’s security safeguards, treating completed remediation as sufficient grounds to close notifications.",
      "Remediation does not erase notification obligations for a breach that occurred."
    ]
  ],
  "breachnotice": [
    [
      "Issue initial notices within the later update window, using that interval to gather the outstanding facts.",
      "The initial notices are required without delay; the update deadline is a separate requirement."
    ],
    [
      "Issue the initial Board notice without delay, contacting affected people after forensic analysis confirms complete details.",
      "Initial notice to affected people is not conditional on perfect forensic certainty."
    ],
    [
      "Issue affected-person notices without delay, contacting the Board after the final assessment establishes substantial resulting harm.",
      "The required Board notification is not replaced by that unilateral harm threshold."
    ]
  ],
  "rights": [
    [
      "Provide the current privacy policy describing processing, using the completed identity checks to close the request.",
      "A generic policy does not supply the requested account-specific summary."
    ],
    [
      "Provide the stored profile fields without processing details, using the completed identity checks to complete responses.",
      "The entitlement is not necessarily satisfied by raw fields alone."
    ],
    [
      "Provide instructions for obtaining judicial authorization, using the completed identity checks to prepare the eventual disclosure.",
      "A court order is not the general prerequisite for exercising this right."
    ]
  ],
  "correction": [
    [
      "Record the verified name in the correction queue, retaining existing processing records until the annual review.",
      "Recording a request without appropriately correcting the data does not resolve the issue."
    ],
    [
      "Update the verified name in the customer interface, retaining existing names in the operational processing records.",
      "A cosmetic update does not correct the inaccurate data still in use."
    ],
    [
      "Prepare the verified name correction for processing, applying it once the customer withdraws unrelated service consent.",
      "Unrelated withdrawal is not the required condition for a valid correction."
    ]
  ],
  "grievance": [
    [
      "Provide an accessible complaint address with receipt tracking, allowing individual teams to decide ownership after submission.",
      "A nominal address is not an effective grievance redressal mechanism."
    ],
    [
      "Provide direct Board referral with supporting ticket details, routing unresolved requests externally before offering internal redress.",
      "The person must have the opportunity to use the required internal grievance mechanism first."
    ],
    [
      "Provide internal redress with an assigned owner, activating the grievance process after the customer closes accounts.",
      "Closing an account should not be the gate to the grievance mechanism."
    ]
  ],
  "retention": [
    [
      "Erase unnecessary company copies and document completion, leaving processor copies available under their existing storage arrangements.",
      "The erasure duty also requires causing processors to erase where applicable."
    ],
    [
      "Archive company and processor copies under legal hold, identifying the specific retention requirement during subsequent review.",
      "A label alone does not establish that retention is required by law."
    ],
    [
      "Remove account identifiers from company and processor copies, retaining other identifiable profile details for operational reference.",
      "Removing one identifier does not necessarily erase or anonymise the personal data."
    ]
  ],
  "purposeend": [
    [
      "Encrypt the dietary preferences after purpose completion, preserving them for potential reuse during a future event.",
      "Encryption does not extend an exhausted purpose or create a retention requirement."
    ],
    [
      "Retain the dietary preferences with processing logs, applying the log-retention requirement across the complete attendee profile.",
      "A requirement for certain records does not authorize keeping all unrelated fields."
    ],
    [
      "Archive the dietary preferences under restricted access, treating removal from the active database as completed erasure.",
      "Relocation and access restriction are not erasure."
    ]
  ],
  "accuracy": [
    [
      "Run the decision and flag conflicting records, initiating reconciliation if the customer subsequently challenges the assessment.",
      "The accuracy requirement matters before the data is used for the affecting decision."
    ],
    [
      "Select the newer timestamped record, treating its recency as sufficient resolution of the conflicting customer information.",
      "Recency alone does not resolve the completeness, accuracy and consistency problem."
    ],
    [
      "Ask the vendor to reconcile conflicting records, allowing queued decisions to proceed while confirmation remains outstanding.",
      "Seeking confirmation later does not address the unresolved conflict before use."
    ]
  ],
  "foreign": [
    [
      "Check destination restrictions and provider safeguards before approving migration, treating sector requirements as covered by checks.",
      "Other applicable laws may impose stricter restrictions."
    ],
    [
      "Obtain specific customer consent and provider safeguards before approving migration, treating consent as overriding destination restrictions.",
      "Consent does not override applicable transfer restrictions."
    ],
    [
      "Review provider reputation and contractual safeguards before approving migration, treating those assurances as establishing transfer eligibility.",
      "Provider reputation and a contract do not replace checking applicable restrictions."
    ]
  ],
  "publicdata": [
    [
      "Establish that the page requires no login before treating its visible contents as excluded personal data.",
      "Public visibility alone does not establish who made it public or under what obligation."
    ],
    [
      "Obtain the vendor’s confirmation of public accessibility before treating the discovered profile as meeting exclusion conditions.",
      "Finding a public page does not establish the relevant statutory conditions."
    ],
    [
      "Verify consent for the existing private account before treating that agreement as authorization for public-profile combination.",
      "A private account purpose does not automatically authorize that separate combination."
    ]
  ],
  "contact": [
    [
      "Publish the cloud provider’s support details for processing questions, relying on its infrastructure expertise when responding.",
      "The contact must be able to answer on the Data Fiduciary’s behalf."
    ],
    [
      "Assign an internal privacy owner for processing questions, maintaining contact details within the service’s internal directory.",
      "An internal assignment does not satisfy the publication requirement."
    ],
    [
      "Publish the sales team’s contact details for processing questions, relying on its existing customer communication role.",
      "A reachable but unsuitable contact does not meet the stated function."
    ]
  ],
  "consentproof": [
    [
      "Link the current notice version, stated purpose and recorded timestamp as evidence of earlier consent interaction.",
      "A current notice does not prove what was actually presented when consent was obtained."
    ],
    [
      "Link the general terms acceptance and recorded timestamp as evidence of consent for the processing purpose.",
      "A general flag does not demonstrate compliant notice and consent for the relevant purpose."
    ],
    [
      "Link a reconstructed notice screen and recorded timestamp, presenting the reconstruction as evidence of original interaction.",
      "A reconstruction must not be substituted for proof of the actual interaction."
    ]
  ],
  "complaint": [
    [
      "Accept the correction using supplied documents, treating further identity checks as an obstacle to exercising rights.",
      "Rights requests still require authentic information and must not facilitate impersonation."
    ],
    [
      "Classify the mismatch as established impersonation, distributing the supplied documents across operational teams for immediate awareness.",
      "Suspicion is not proof and does not justify unnecessary disclosure of the documents."
    ],
    [
      "Confirm the account exists using internal records, treating that confirmation as sufficient verification of correction requests.",
      "Account existence alone does not resolve the authenticity and impersonation concern."
    ]
  ],
  "accesscontrol": [
    [
      "Retain UI and API export permissions with monitoring, adding usage restrictions and alerts for unusual activity.",
      "Monitoring does not remove the unnecessary access itself."
    ],
    [
      "Disable customer exports within the user interface, retaining API export permission for continuity of operational integrations.",
      "A hidden interface does not revoke the underlying access."
    ],
    [
      "Require stronger authentication for UI and API access, retaining existing export permissions within the assigned role.",
      "Stronger authentication does not make excessive authorization appropriate."
    ]
  ]
};

export const difficultyNames=['FIELD INTAKE','CROSS-CHECK','EXPERT JUDGEMENT'];
export const difficultyFor=(turn,total)=>Math.min(2,Math.floor(turn*3/Math.max(1,total)));
export function answerOptions(sc,turn,total){return [sc.a,...(closeChoices[sc.id]?.map(c=>c[0])||sc.bad)];}
export function wrongReason(sc,choice,turn,total){if(choice<1)return '';return closeChoices[sc.id]?.[choice-1]?.[1]||sc.why;}
export function orderedChoices(sc,runId,turn,total){const choices=answerOptions(sc,turn,total).map((text,i)=>({text,i}));let seed=2166136261;for(const c of runId+':'+turn)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;for(let i=3;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}return choices;}
