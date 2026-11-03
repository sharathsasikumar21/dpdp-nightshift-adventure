// Source observations, not answer keys. These notes do not resolve the legal decision.
const notes={
 toggle:[
 ['The recorded upload occurs before the permission-screen event.','This sequence alone does not identify which notice or account setting applied.','Can the upload, account and permission-screen version be matched?'],
 ['Marketing requested a promotional use of class-alert numbers.','A request records an intention; it is not evidence of customer approval.','Which source records the purpose customers were originally shown?'],
 ['The proposed interface combines two purposes in one checkbox.','A mock-up does not show what any particular person actually selected.','Was this interface deployed, and which version did people see?']],
 permission:[
 ['The receipt records withdrawal from offers while distinguishing the core service.','It does not show whether downstream campaign jobs applied the change.','Which queued jobs and recipients received the updated preference?'],
 ['The recording shows a one-tap entry and a much longer withdrawal route.','A recording of one route does not establish all available routes or their accessibility.','Were other withdrawal paths available to this user at that time?'],
 ['The proposal includes a consent tool and an advertising-profiling use.','A proposal does not establish the tool’s registration, deployed controls or actual processing.','What verified records describe the proposed operator and its data uses?']],
 'city-form':[
 ['The schema contains eligibility fields, contacts and browsing history.','A field list does not explain why each field is needed or whether it has been populated.','Which fields were actually collected, and what documented function uses each one?'],
 ['The launch brief records possible future use as the reason for extra fields.','A launch brief does not establish a specific later use or its authority.','Is there a separate approved purpose record for those extra fields?'],
 ['The office’s request cites government status without naming its function or required records.','The requester’s identity alone does not establish the scope of the request.','Which documented function and record categories support this request?']],
 schoolyard:[
 ['The trace records learning events feeding an advertising profile.','The trace does not establish every recipient, affected account or applicable exception.','Which children, recipients and module versions appear in the original logs?'],
 ['The account lists age sixteen and lacks the specified verification and exception records.','An absent record here does not prove that every other system has been searched.','Have the account’s linked consent and exception records been checked?'],
 ['The recording shows a guardian unable to use the request form with assistive controls.','One recording does not establish the behaviour of every supported device or alternative channel.','Which accessible routes were actually available to this guardian?']],
 vendor:[
 ['The email requests a separate research copy beyond appointment reminders.','A sales request does not establish that a copy was made or that its use was authorised.','Was a copy sent, to whom, and under which documented arrangement?'],
 ['The ticket proposes identifiable event access outside the reviewed arrangement.','A proposed ticket does not establish when access became active or which records were viewed.','Do access logs show activation, use or onward disclosure?'],
 ['The thread records executives’ assumption about the contract.','A management assumption is not proof of the actual contract terms or allocation of tasks.','Which signed terms and operating records support the responsibilities claimed?']],
 breach:[
 ['The status display records an active personal-drive upload with an unknown copy count.','It does not establish the full recipient list or that stopping this process removes existing copies.','Which copies, recipients and retry jobs can the source logs corroborate?'],
 ['The provider confirms exposure of company records without proof of completed notices.','A provider’s offer does not establish that any required recipient was notified.','What acknowledgements or delivery records show who was told and when?'],
 ['The draft is held while the team awaits all forensic details.','A draft’s status does not establish when the incident was discovered or which facts were already known.','What does the incident timeline establish about discovery and known facts?']],
 'rights-desk':[
 ['The ticket asks for an account-specific processing summary.','The request text does not itself establish what records have been searched or supplied.','Which account-specific records and response history are available?'],
 ['Credible evidence supports the name correction and no verification issue remains in this case.','That evidence does not show whether every relevant copy or pending use has been updated.','Which systems and recipients still hold the previous spelling?'],
 ['The queue records an unanswered deletion request with no assigned grievance owner.','A queue entry does not establish whether another channel has handled the request.','What response history and ownership records exist across the available channels?']],
 'memory-drawer':[
 ['The inventory lists staging profiles and processor copies after the event ended.','An inventory does not prove all copies have been found or establish each retention justification.','Which processors, backups and source owners can confirm the remaining copies?'],
 ['The review distinguishes dietary preferences from separately required processing records.','This review does not identify the retention requirements for every other record category.','Which record-specific retention duties and dates have actually been documented?'],
 ['The queued refund decision relies on contradictory attendee records.','The contradiction alone does not identify which value is correct.','Which reliable source can reconcile the conflicting values before their use?']],
 'borderless-copy':[
 ['The migration plan lacks destination and restriction checks.','An unchecked plan does not establish that a transfer is either allowed or prohibited.','Which destination, applicable directions and sector-specific requirements have been verified?'],
 ['The page is visible publicly but its publication history is unknown.','Visibility alone does not identify who made the data public or why.','Who published the personal data, and what source establishes that history?'],
 ['The help page lists the cloud provider without an accountable business contact.','A published page does not establish every internal role or unpublished contact route.','Which responsible person can answer for the service’s processing?']],
 'audit-trail':[
 ['The export records a timestamp without the linked notice or affirmative-action record.','A timestamp alone does not reconstruct what the person saw or did.','Can the notice version, account and action be linked from original records?'],
 ['The attachment appears to contain another person’s unverified identity documents.','An apparent mismatch does not establish the requester’s identity or authority.','What reliable evidence can establish who is making the request and for whom?'],
 ['The inventory shows an active broad export role for an intern needing ticket status.','The role inventory does not establish whether any export occurred.','Which access and export logs show how the role was actually used?']]
};
export function evidenceInsight(storyId,index){const n=notes[storyId]?.[index];return n?{establishes:n[0],limit:n[1],verify:n[2]}:null;}
