import { BASE_BANK, type ScenarioBase } from "./scenarios";

interface SceneScript { sourceId: string; plot: string; q: string }
interface StoryScript { id: string; title: string; scenes: [SceneScript, SceneScript, SceneScript] }

const STORIES: StoryScript[] = [
  { id: "toggle", title: "The Toggle at 01:17", scenes: [
    { sourceId: "notice", plot: "PulseStep’s new nearby-classes feature requests location the moment the app opens. A tester flags that the permission appears before anyone sees what the location is for.", q: "The release manager wants the feature live before morning. What must happen before location starts flowing?" },
    { sourceId: "purpose", plot: "At 01:42, marketing asks to reuse the phone numbers collected for class alerts to sell premium memberships. Same customers, new purpose, same deadline.", q: "What should the team require before using those numbers for promotions?" },
    { sourceId: "consentseparate", plot: "An ad partner offers to fund the feature if safety alerts and promotions share one checkbox. Product says separate choices will lower conversions.", q: "How should the consent screen handle these unrelated uses?" },
  ] },
  { id: "permission", title: "The Permission That Wouldn’t Leave", scenes: [
    { sourceId: "withdraw", plot: "Mira withdraws permission for personalized offers but wants to keep using her account. A retention dashboard marks her as a churn risk.", q: "How should the service respond to Mira’s withdrawal?" },
    { sourceId: "noticewithdraw", plot: "The settings team reveals that withdrawal takes nine screens, while giving permission took one tap. Support has already received complaints.", q: "What should change in the notice and the withdrawal path?" },
    { sourceId: "consentmanager", plot: "Mira asks for one place to review permissions she gave to several services. A partner offers a consent dashboard but wants to use it for ad targeting too.", q: "Which kind of service is meant to help her manage consent across providers?" },
  ] },
  { id: "city-form", title: "The Form That Ate the City", scenes: [
    { sourceId: "minimum", plot: "A city grant portal asks applicants for eligibility documents, full contact lists, and unrelated browsing history. The vendor says extra fields will make future fraud checks easier.", q: "What should the portal collect for this application?" },
    { sourceId: "lawfulbasis", plot: "A new analyst proposes keeping every field because another department may someday find it useful. No present purpose is written in the launch brief.", q: "What must the team identify before collecting more data?" },
    { sourceId: "legitimate", plot: "A public office sends a request for records needed to perform a function imposed by law. The request is broad and cites no specific function.", q: "What is the right first step before processing the request?" },
  ] },
  { id: "schoolyard", title: "The Schoolyard Signal", scenes: [
    { sourceId: "child", plot: "A learning game’s new ad module tracks how children pause, replay, and abandon lessons. The growth team calls it ordinary product analytics.", q: "What safeguards apply before processing children’s data for this feature?" },
    { sourceId: "childconsent", plot: "A sixteen-year-old accepts the new terms on a tablet. The account profile lists no parent or guardian contact.", q: "What additional step is generally required before processing?" },
    { sourceId: "requestchannel", plot: "A guardian asks to correct a child’s profile, but the only request form is unreadable with assistive technology and rejects keyboard navigation.", q: "What should the service provide for rights requests and grievances?" },
  ] },
  { id: "vendor", title: "The Vendor at 02:14", scenes: [
    { sourceId: "processor", plot: "A reminder vendor needs names and phone numbers to send appointment messages. Its sales lead asks to keep a copy for unrelated product research.", q: "What should the startup put in place before sharing customer data?" },
    { sourceId: "securityvendor", plot: "The analytics processor proposes a subcontractor that will see identifiable events. The release is already scheduled and the contract owner is offline.", q: "What should the privacy lead do before that access begins?" },
    { sourceId: "fiduciary", plot: "After a vendor incident, executives say the processor caused it, so the company has no responsibility. The response channel is waiting for an owner.", q: "Who remains responsible for meeting the Data Fiduciary’s duties?" },
  ] },
  { id: "breach", title: "The Red Light at 02:31", scenes: [
    { sourceId: "security", plot: "An employee exported customer records to a personal drive. The drive is still syncing, and nobody can confirm how many copies exist.", q: "What should the response team prioritize now?" },
    { sourceId: "breach", plot: "A cloud provider reports that records held for the company were exposed. Its support agent says the vendor will handle every notice.", q: "Who must ensure required breach notifications are made?" },
    { sourceId: "breachnotice", plot: "The incident commander wants to wait until every detail is certain; communications worries that a notice will damage trust.", q: "What should govern notice to the Board and affected people?" },
  ] },
  { id: "rights-desk", title: "The Rights Desk After Hours", scenes: [
    { sourceId: "rights", plot: "A user asks for a summary of the personal data and the processing activities tied to their account. The support script offers only a privacy-policy link.", q: "How should the service handle the access request?" },
    { sourceId: "correction", plot: "A customer shows that their profile misspells their name. A support agent says profile changes are locked until the next annual review.", q: "What should the service do with a valid correction request?" },
    { sourceId: "grievance", plot: "A deletion request went unanswered. The customer now wants to file a grievance, but the product team cannot find a complaint owner.", q: "What process should the Data Fiduciary have available?" },
  ] },
  { id: "memory-drawer", title: "The Memory Drawer", scenes: [
    { sourceId: "retention", plot: "The ticketing service finished an event months ago. Extra attendee profile data remains in a staging bucket with no owner.", q: "What should happen to data no longer needed for its purpose?" },
    { sourceId: "purposeend", plot: "A one-time event is over and no law requires keeping dietary preferences. Operations wants to retain them in case the event returns.", q: "What is the sound approach after the purpose is complete?" },
    { sourceId: "accuracy", plot: "A lender finds contradictory profile records just before using them for a decision that affects a customer. The scoring job is queued.", q: "What should happen before the data is used for that decision?" },
  ] },
  { id: "borderless-copy", title: "The Borderless Copy", scenes: [
    { sourceId: "foreign", plot: "A service wants to move account data to a cloud region outside India. The engineer says the Act bans every overseas transfer.", q: "What is the DPDP Act’s baseline on transfers outside India?" },
    { sourceId: "publicdata", plot: "A vendor finds profile details on a public page and proposes combining them with the overseas account copy. The source and the person who posted it are unclear.", q: "What should the team check before reusing publicly visible data?" },
    { sourceId: "contact", plot: "A user asks who can explain the processing and how to raise a concern. The help page lists the cloud vendor but no responsible contact.", q: "What contact information should the Data Fiduciary publish?" },
  ] },
  { id: "audit-trail", title: "The Audit Trail Nobody Budgeted For", scenes: [
    { sourceId: "consentproof", plot: "A reviewer asks how one user agreed to a specific data use. The team can find a timestamp but not the notice or action shown at the time.", q: "What should the service be able to demonstrate about consent?" },
    { sourceId: "complaint", plot: "A correction request arrives with documents that appear to belong to someone else. A manager wants to publish them in the team chat to expose the fraud.", q: "How should the team handle authenticity and the person’s duties?" },
    { sourceId: "accesscontrol", plot: "The audit finds that a support intern can download every customer record, though the role needs only ticket status. The access review is overdue.", q: "What access change should happen next?" },
  ] },
];

export interface Scenario extends ScenarioBase {
  sourceId: string;
  storyId: string;
  storyTitle: string;
  storyPart: number;
  plot: string;
}

const scripts = new Map<string, { storyId: string; storyTitle: string; storyPart: number; plot: string; q: string }>();
for (const story of STORIES) story.scenes.forEach((scene, index) => scripts.set(scene.sourceId, {
  storyId: story.id, storyTitle: story.title, storyPart: index + 1, plot: scene.plot, q: scene.q,
}));

export const BANK: Scenario[] = BASE_BANK.map((item) => {
  const script = scripts.get(item.id);
  if (!script) throw new Error(`Missing story script for ${item.id}`);
  return { ...item, ...script, sourceId: item.id, id: `arc_${script.storyId}_${script.storyPart}` };
});
