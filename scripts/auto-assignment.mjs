/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default async function autoAssign({ github, context }) {
  let issueNumber;
  let activeAssigneesList;

  // Hardcoded assignee lists
  const issueAssigneesList = ['Varun-S10'];
  const prAssigneesList = ['Varun-S10'];
  console.log('Auto-assignment script started');

  // Determine event type
  if (context.payload.issue) {
    issueNumber = context.payload.issue.number;
    activeAssigneesList = issueAssigneesList;
    console.log('Event Type: Issue');
  } else if (context.payload.pull_request) {
    issueNumber = context.payload.pull_request.number;
    activeAssigneesList = prAssigneesList;
    console.log('Event Type: Pull Request');
  } else {
    console.log('Not an Issue or PR event');
    return;
  }

  if (!activeAssigneesList || activeAssigneesList.length === 0) {
    console.log('No assignees configured.');
    return;
  }

  // Round-robin assignment
  const selection = issueNumber % activeAssigneesList.length;
  const assigneeToAssign = activeAssigneesList[selection];

  console.log(`Assigning #${issueNumber} to ${assigneeToAssign}`);

  await github.rest.issues.addAssignees({
    issue_number: issueNumber,
    owner: context.repo.owner,
    repo: context.repo.repo,
    assignees: [assigneeToAssign],
  });
}
