import type {
  ProjectStatus,
  InvoiceStatus,
  TicketPriority,
  TicketStatus,
  ContractStatus,
  PaymentStatus,
  NotificationType,
  ClientProject,
  ClientTeamMember,
  ClientMilestone,
  ClientActivity,
  ClientContract,
  ContractDocument,
  ContractHistoryEntry,
  ClientInvoice,
  InvoiceLineItem,
  InvoicePayment,
  ClientPayment,
  ClientSupportTicket,
  SupportMessage,
  ClientProfile,
  ClientNotification,
  CreateTicketData,
  CreatePaymentData,
  UpdateProfileData,
  NotificationPreferences,
} from '../types/constants';

export {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  TICKET_PRIORITY,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_COLORS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS,
  TICKET_CATEGORIES,
} from '../types/constants';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const CLIENT_ID = 'client_demo_001';

const mockProjects: ClientProject[] = [
  {
    id: 'proj_001',
    name: 'E-commerce Platform',
    description: 'Complete e-commerce platform with payment integration, inventory management, and customer dashboard.',
    status: 'in_progress',
    progress: 72,
    startDate: '2024-01-15',
    endDate: '2024-08-30',
    budget: 85000,
    spent: 61200,
    clientId: CLIENT_ID,
    managerId: 'mgr_001',
    managerName: 'Sarah Johnson',
    team: [
      { id: 'emp_001', name: 'John Smith', role: 'Lead Developer', email: 'john@foundryone.com', joinedAt: '2024-01-15' },
      { id: 'emp_002', name: 'Emily Chen', role: 'UI/UX Designer', email: 'emily@foundryone.com', joinedAt: '2024-01-15' },
      { id: 'emp_003', name: 'Michael Brown', role: 'Backend Developer', email: 'michael@foundryone.com', joinedAt: '2024-02-01' },
      { id: 'emp_004', name: 'Lisa Wang', role: 'QA Engineer', email: 'lisa@foundryone.com', joinedAt: '2024-02-15' },
    ],
    milestones: [
      { id: 'ms_001', title: 'Requirements & Planning', description: 'Gather requirements and create project plan', dueDate: '2024-02-01', completedAt: '2024-02-01', status: 'completed', order: 1 },
      { id: 'ms_002', title: 'UI/UX Design', description: 'Complete wireframes and high-fidelity designs', dueDate: '2024-03-01', completedAt: '2024-02-28', status: 'completed', order: 2 },
      { id: 'ms_003', title: 'Frontend Development', description: 'Build React frontend with responsive design', dueDate: '2024-05-01', completedAt: '2024-05-05', status: 'completed', order: 3 },
      { id: 'ms_004', title: 'Backend Development', description: 'Implement API endpoints and database schema', dueDate: '2024-06-01', completedAt: undefined, status: 'overdue', order: 4 },
      { id: 'ms_005', title: 'Testing & QA', description: 'Complete unit tests, integration tests, and UAT', dueDate: '2024-07-15', completedAt: undefined, status: 'pending', order: 5 },
      { id: 'ms_006', title: 'Deployment & Launch', description: 'Deploy to production and final handover', dueDate: '2024-08-30', completedAt: undefined, status: 'pending', order: 6 },
    ],
    recentActivity: [
      { id: 'act_001', type: 'update', title: 'Payment processed', description: 'Invoice #INV-2024-012 has been paid', createdAt: '2024-06-10T14:30:00Z', author: 'Sarah Johnson' },
      { id: 'act_002', type: 'milestone', title: 'Milestone completed', description: 'Frontend Development milestone has been completed', createdAt: '2024-06-08T09:00:00Z', author: 'John Smith' },
      { id: 'act_003', type: 'comment', title: 'New comment', description: 'Please review the latest dashboard mockups', createdAt: '2024-06-05T16:45:00Z', author: 'Emily Chen' },
      { id: 'act_004', type: 'status_change', title: 'Status updated', description: 'Project moved from Planning to In Progress', createdAt: '2024-01-20T10:00:00Z', author: 'Sarah Johnson' },
    ],
  },
  {
    id: 'proj_002',
    name: 'CRM Integration',
    description: 'Integration of Salesforce CRM with internal systems for automated lead tracking and reporting.',
    status: 'in_progress',
    progress: 45,
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    budget: 45000,
    spent: 20250,
    clientId: CLIENT_ID,
    managerId: 'mgr_002',
    managerName: 'David Lee',
    team: [
      { id: 'emp_005', name: 'Anna Martinez', role: 'Integration Specialist', email: 'anna@foundryone.com', joinedAt: '2024-03-01' },
      { id: 'emp_006', name: 'Tom Wilson', role: 'Data Engineer', email: 'tom@foundryone.com', joinedAt: '2024-03-10' },
    ],
    milestones: [
      { id: 'ms_007', title: 'API Discovery', description: 'Map Salesforce APIs and data models', dueDate: '2024-04-01', completedAt: '2024-03-30', status: 'completed', order: 1 },
      { id: 'ms_008', title: 'Integration Development', description: 'Build middleware for data synchronization', dueDate: '2024-06-01', completedAt: undefined, status: 'overdue', order: 2 },
      { id: 'ms_009', title: 'Testing & Validation', description: 'Validate data flows and error handling', dueDate: '2024-08-01', completedAt: undefined, status: 'pending', order: 3 },
      { id: 'ms_010', title: 'Go-Live', description: 'Production deployment and training', dueDate: '2024-09-30', completedAt: undefined, status: 'pending', order: 4 },
    ],
    recentActivity: [
      { id: 'act_005', type: 'update', title: 'Milestone delayed', description: 'Integration Development milestone is now overdue', createdAt: '2024-06-02T11:00:00Z', author: 'David Lee' },
      { id: 'act_006', type: 'comment', title: 'New comment', description: 'We need to discuss the data mapping approach', createdAt: '2024-05-28T14:20:00Z', author: 'Anna Martinez' },
    ],
  },
  {
    id: 'proj_003',
    name: 'Mobile App',
    description: 'Cross-platform mobile application for customer engagement with push notifications and offline support.',
    status: 'in_progress',
    progress: 88,
    startDate: '2024-02-01',
    endDate: '2024-07-15',
    budget: 72000,
    spent: 63360,
    clientId: CLIENT_ID,
    managerId: 'mgr_003',
    managerName: 'Emily Davis',
    team: [
      { id: 'emp_007', name: 'Chris Taylor', role: 'Mobile Developer', email: 'chris@foundryone.com', joinedAt: '2024-02-01' },
      { id: 'emp_008', name: 'Sophie Clark', role: 'QA Lead', email: 'sophie@foundryone.com', joinedAt: '2024-02-10' },
      { id: 'emp_009', name: 'James White', role: 'Backend Developer', email: 'james@foundryone.com', joinedAt: '2024-02-15' },
    ],
    milestones: [
      { id: 'ms_011', title: 'App Architecture', description: 'Define tech stack and architecture', dueDate: '2024-02-15', completedAt: '2024-02-15', status: 'completed', order: 1 },
      { id: 'ms_012', title: 'Core Features', description: 'Implement authentication, profiles, and core screens', dueDate: '2024-04-01', completedAt: '2024-04-05', status: 'completed', order: 2 },
      { id: 'ms_013', title: 'Testing & Optimization', description: 'Performance testing and bug fixes', dueDate: '2024-06-01', completedAt: undefined, status: 'overdue', order: 3 },
      { id: 'ms_014', title: 'App Store Launch', description: 'Prepare and submit to app stores', dueDate: '2024-07-15', completedAt: undefined, status: 'pending', order: 4 },
    ],
    recentActivity: [
      { id: 'act_007', type: 'update', title: 'Code review completed', description: 'All PRs for core features have been reviewed and merged', createdAt: '2024-06-12T08:30:00Z', author: 'Chris Taylor' },
      { id: 'act_008', type: 'milestone', title: 'Milestone approaching', description: 'Testing & Optimization milestone is due soon', createdAt: '2024-06-01T10:00:00Z', author: 'Emily Davis' },
    ],
  },
  {
    id: 'proj_004',
    name: 'Data Migration',
    description: 'Legacy system data migration to modern cloud infrastructure with zero downtime.',
    status: 'completed',
    progress: 100,
    startDate: '2023-10-01',
    endDate: '2024-03-31',
    budget: 55000,
    spent: 54200,
    clientId: CLIENT_ID,
    managerId: 'mgr_004',
    managerName: 'Robert Brown',
    team: [
      { id: 'emp_010', name: 'Alice Green', role: 'Data Architect', email: 'alice@foundryone.com', joinedAt: '2023-10-01' },
      { id: 'emp_011', name: 'Bob Harris', role: 'DevOps Engineer', email: 'bob@foundryone.com', joinedAt: '2023-10-10' },
    ],
    milestones: [
      { id: 'ms_015', title: 'Assessment', description: 'Analyze legacy data and define migration strategy', dueDate: '2023-10-31', completedAt: '2023-10-30', status: 'completed', order: 1 },
      { id: 'ms_016', title: 'Migration Execution', description: 'Execute the data migration with rollback plan', dueDate: '2024-02-15', completedAt: '2024-02-15', status: 'completed', order: 2 },
      { id: 'ms_017', title: 'Validation & Handover', description: 'Validate data integrity and provide documentation', dueDate: '2024-03-31', completedAt: '2024-03-28', status: 'completed', order: 3 },
    ],
    recentActivity: [
      { id: 'act_009', type: 'status_change', title: 'Project completed', description: 'Data Migration project has been successfully completed', createdAt: '2024-03-31T17:00:00Z', author: 'Robert Brown' },
    ],
  },
];

const mockContracts: ClientContract[] = [
  {
    id: 'contract_001',
    title: 'E-commerce Platform Development Agreement',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    value: 85000,
    clientId: CLIENT_ID,
    terms: 'This agreement outlines the terms for the development of a complete e-commerce platform...',
    documents: [
      { id: 'doc_001', name: 'Main Contract', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-01-15', url: '#' },
      { id: 'doc_002', name: 'SOW - Statement of Work', type: 'PDF', size: '1.1 MB', uploadedAt: '2024-01-15', url: '#' },
      { id: 'doc_003', name: 'Payment Schedule', type: 'XLSX', size: '450 KB', uploadedAt: '2024-01-16', url: '#' },
    ],
    history: [
      { id: 'ch_001', action: 'Contract Created', description: 'Initial contract draft created by FoundryOne', performedBy: 'System', performedAt: '2024-01-10T09:00:00Z' },
      { id: 'ch_002', action: 'Contract Signed', description: 'Contract signed by both parties', performedBy: 'Sarah Johnson', performedAt: '2024-01-15T14:00:00Z' },
      { id: 'ch_003', action: 'Amendment 1', description: 'Scope updated to include mobile app integration', performedBy: 'Sarah Johnson', performedAt: '2024-02-01T10:00:00Z' },
    ],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'contract_002',
    title: 'CRM Integration Services Agreement',
    projectId: 'proj_002',
    projectName: 'CRM Integration',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-10-01',
    value: 45000,
    clientId: CLIENT_ID,
    terms: 'This agreement covers the integration services for Salesforce CRM...',
    documents: [
      { id: 'doc_004', name: 'Service Agreement', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-02-25', url: '#' },
    ],
    history: [
      { id: 'ch_004', action: 'Contract Created', description: 'Initial contract draft created by FoundryOne', performedBy: 'System', performedAt: '2024-02-20T09:00:00Z' },
      { id: 'ch_005', action: 'Contract Signed', description: 'Contract signed by both parties', performedBy: 'David Lee', performedAt: '2024-03-01T11:00:00Z' },
    ],
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
  },
  {
    id: 'contract_003',
    title: 'Mobile App Development Contract',
    projectId: 'proj_003',
    projectName: 'Mobile App',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    value: 72000,
    clientId: CLIENT_ID,
    terms: 'This agreement covers the development of a cross-platform mobile application...',
    documents: [
      { id: 'doc_005', name: 'Development Contract', type: 'PDF', size: '2.1 MB', uploadedAt: '2024-01-28', url: '#' },
      { id: 'doc_006', name: 'Technical Specifications', type: 'PDF', size: '3.2 MB', uploadedAt: '2024-01-29', url: '#' },
    ],
    history: [
      { id: 'ch_006', action: 'Contract Created', description: 'Initial contract draft created by FoundryOne', performedBy: 'System', performedAt: '2024-01-25T09:00:00Z' },
      { id: 'ch_007', action: 'Contract Signed', description: 'Contract signed by both parties', performedBy: 'Emily Davis', performedAt: '2024-02-01T09:00:00Z' },
    ],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'contract_004',
    title: 'Data Migration Services Agreement',
    projectId: 'proj_004',
    projectName: 'Data Migration',
    status: 'expired',
    startDate: '2023-10-01',
    endDate: '2024-03-31',
    value: 55000,
    clientId: CLIENT_ID,
    terms: 'This agreement covers the data migration services from legacy systems to cloud infrastructure...',
    documents: [
      { id: 'doc_007', name: 'Completed Contract', type: 'PDF', size: '1.5 MB', uploadedAt: '2023-09-25', url: '#' },
    ],
    history: [
      { id: 'ch_008', action: 'Contract Created', description: 'Initial contract draft created by FoundryOne', performedBy: 'System', performedAt: '2023-09-20T09:00:00Z' },
      { id: 'ch_009', action: 'Contract Signed', description: 'Contract signed by both parties', performedBy: 'Robert Brown', performedAt: '2023-10-01T10:00:00Z' },
      { id: 'ch_010', action: 'Contract Completed', description: 'All obligations fulfilled, contract naturally expired', performedBy: 'System', performedAt: '2024-03-31T23:59:00Z' },
    ],
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2024-03-31T23:59:00Z',
  },
];

const mockInvoices: ClientInvoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2024-001',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    status: 'paid',
    amount: 15000,
    tax: 2250,
    total: 17250,
    currency: 'USD',
    issueDate: '2024-02-01',
    dueDate: '2024-02-15',
    paidDate: '2024-02-14',
    lineItems: [
      { id: 'li_001', description: 'Requirements & Planning Phase', quantity: 1, unitPrice: 15000, total: 15000 },
    ],
    payments: [
      { id: 'pay_001', amount: 17250, method: 'Bank Transfer', transactionId: 'TXN-20240214-001', status: 'completed', date: '2024-02-14' },
    ],
    clientId: CLIENT_ID,
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2024-002',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    status: 'paid',
    amount: 25000,
    tax: 3750,
    total: 28750,
    currency: 'USD',
    issueDate: '2024-04-01',
    dueDate: '2024-04-15',
    paidDate: '2024-04-12',
    lineItems: [
      { id: 'li_002', description: 'UI/UX Design Phase', quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    payments: [
      { id: 'pay_002', amount: 28750, method: 'Bank Transfer', transactionId: 'TXN-20240412-001', status: 'completed', date: '2024-04-12' },
    ],
    clientId: CLIENT_ID,
    createdAt: '2024-04-01T08:00:00Z',
    updatedAt: '2024-04-12T10:00:00Z',
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2024-003',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    status: 'overdue',
    amount: 20000,
    tax: 3000,
    total: 23000,
    currency: 'USD',
    issueDate: '2024-05-01',
    dueDate: '2024-05-15',
    lineItems: [
      { id: 'li_003', description: 'Frontend Development Phase', quantity: 1, unitPrice: 20000, total: 20000 },
    ],
    payments: [],
    clientId: CLIENT_ID,
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-01T08:00:00Z',
  },
  {
    id: 'inv_004',
    invoiceNumber: 'INV-2024-004',
    projectId: 'proj_002',
    projectName: 'CRM Integration',
    status: 'sent',
    amount: 15000,
    tax: 2250,
    total: 17250,
    currency: 'USD',
    issueDate: '2024-05-15',
    dueDate: '2024-05-30',
    lineItems: [
      { id: 'li_004', description: 'API Discovery Phase', quantity: 1, unitPrice: 15000, total: 15000 },
    ],
    payments: [],
    clientId: CLIENT_ID,
    createdAt: '2024-05-15T08:00:00Z',
    updatedAt: '2024-05-15T08:00:00Z',
  },
  {
    id: 'inv_005',
    invoiceNumber: 'INV-2024-005',
    projectId: 'proj_003',
    projectName: 'Mobile App',
    status: 'paid',
    amount: 35000,
    tax: 5250,
    total: 40250,
    currency: 'USD',
    issueDate: '2024-04-01',
    dueDate: '2024-04-15',
    paidDate: '2024-04-14',
    lineItems: [
      { id: 'li_005', description: 'Core Features Development', quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    payments: [
      { id: 'pay_003', amount: 40250, method: 'Credit Card', transactionId: 'TXN-20240414-001', status: 'completed', date: '2024-04-14' },
    ],
    clientId: CLIENT_ID,
    createdAt: '2024-04-01T08:00:00Z',
    updatedAt: '2024-04-14T10:00:00Z',
  },
  {
    id: 'inv_006',
    invoiceNumber: 'INV-2024-006',
    projectId: 'proj_004',
    projectName: 'Data Migration',
    status: 'paid',
    amount: 27500,
    tax: 4125,
    total: 31625,
    currency: 'USD',
    issueDate: '2024-03-01',
    dueDate: '2024-03-15',
    paidDate: '2024-03-14',
    lineItems: [
      { id: 'li_006', description: 'Migration Execution Phase', quantity: 1, unitPrice: 27500, total: 27500 },
    ],
    payments: [
      { id: 'pay_004', amount: 31625, method: 'Bank Transfer', transactionId: 'TXN-20240314-001', status: 'completed', date: '2024-03-14' },
    ],
    clientId: CLIENT_ID,
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-14T10:00:00Z',
  },
];

const mockPayments: ClientPayment[] = [
  {
    id: 'pay_001',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2024-001',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    amount: 17250,
    currency: 'USD',
    method: 'Bank Transfer',
    status: 'completed',
    transactionId: 'TXN-20240214-001',
    date: '2024-02-14',
    notes: 'Payment received via wire transfer',
    clientId: CLIENT_ID,
  },
  {
    id: 'pay_002',
    invoiceId: 'inv_002',
    invoiceNumber: 'INV-2024-002',
    projectId: 'proj_001',
    projectName: 'E-commerce Platform',
    amount: 28750,
    currency: 'USD',
    method: 'Bank Transfer',
    status: 'completed',
    transactionId: 'TXN-20240412-001',
    date: '2024-04-12',
    notes: 'Payment received via wire transfer',
    clientId: CLIENT_ID,
  },
  {
    id: 'pay_003',
    invoiceId: 'inv_005',
    invoiceNumber: 'INV-2024-005',
    projectId: 'proj_003',
    projectName: 'Mobile App',
    amount: 40250,
    currency: 'USD',
    method: 'Credit Card',
    status: 'completed',
    transactionId: 'TXN-20240414-001',
    date: '2024-04-14',
    notes: 'Payment received via credit card',
    clientId: CLIENT_ID,
  },
  {
    id: 'pay_004',
    invoiceId: 'inv_006',
    invoiceNumber: 'INV-2024-006',
    projectId: 'proj_004',
    projectName: 'Data Migration',
    amount: 31625,
    currency: 'USD',
    method: 'Bank Transfer',
    status: 'completed',
    transactionId: 'TXN-20240314-001',
    date: '2024-03-14',
    notes: 'Payment received via wire transfer',
    clientId: CLIENT_ID,
  },
];

export const mockTickets: ClientSupportTicket[] = [
  {
    id: 'ticket_001',
    ticketNumber: 'TKT-2024-001',
    subject: 'Unable to access project documents',
    category: 'Technical Issue',
    priority: 'high',
    status: 'in_progress',
    clientId: CLIENT_ID,
    assignedTo: 'Support Team',
    messages: [
      { id: 'msg_001', ticketId: 'ticket_001', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'I cannot access the project documents. It says I do not have permission.', attachments: [], createdAt: '2024-06-10T09:00:00Z' },
      { id: 'msg_002', ticketId: 'ticket_001', authorId: 'support_001', authorName: 'Support Agent', authorRole: 'employee', content: 'We are looking into this. Could you please provide the specific document you are trying to access?', attachments: [], createdAt: '2024-06-10T10:30:00Z' },
      { id: 'msg_003', ticketId: 'ticket_001', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'I am trying to access the design mockups for the E-commerce Platform project.', attachments: [], createdAt: '2024-06-10T11:00:00Z' },
    ],
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
  },
  {
    id: 'ticket_002',
    ticketNumber: 'TKT-2024-002',
    subject: 'Invoice discrepancy on INV-2024-003',
    category: 'Billing',
    priority: 'medium',
    status: 'open',
    clientId: CLIENT_ID,
    assignedTo: 'Billing Team',
    messages: [
      { id: 'msg_004', ticketId: 'ticket_002', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'The amount on invoice INV-2024-003 seems incorrect. Can you please review it?', attachments: ['screenshot.png'], createdAt: '2024-06-12T14:00:00Z' },
    ],
    createdAt: '2024-06-12T14:00:00Z',
    updatedAt: '2024-06-12T14:00:00Z',
  },
  {
    id: 'ticket_003',
    ticketNumber: 'TKT-2024-003',
    subject: 'Request for additional feature',
    category: 'Feature Request',
    priority: 'low',
    status: 'open',
    clientId: CLIENT_ID,
    messages: [
      { id: 'msg_005', ticketId: 'ticket_003', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'We would like to add a reporting dashboard to the E-commerce Platform. Please let us know the cost and timeline.', attachments: [], createdAt: '2024-06-14T09:00:00Z' },
    ],
    createdAt: '2024-06-14T09:00:00Z',
    updatedAt: '2024-06-14T09:00:00Z',
  },
  {
    id: 'ticket_004',
    ticketNumber: 'TKT-2024-004',
    subject: 'Mobile app crashes on startup',
    category: 'Technical Issue',
    priority: 'critical',
    status: 'resolved',
    clientId: CLIENT_ID,
    assignedTo: 'Support Team',
    resolvedAt: '2024-06-08T16:00:00Z',
    messages: [
      { id: 'msg_006', ticketId: 'ticket_004', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'The mobile app crashes immediately after tapping the icon on iOS 17.', attachments: ['crash_log.txt'], createdAt: '2024-06-05T08:00:00Z' },
      { id: 'msg_007', ticketId: 'ticket_004', authorId: 'support_001', authorName: 'Support Agent', authorRole: 'employee', content: 'This is a known issue with iOS 17. We have released an update. Please update to version 2.1.0.', attachments: [], createdAt: '2024-06-05T10:00:00Z' },
      { id: 'msg_008', ticketId: 'ticket_004', authorId: 'client_001', authorName: 'Client User', authorRole: 'client', content: 'The update fixed the issue. Thank you!', attachments: [], createdAt: '2024-06-08T15:00:00Z' },
    ],
    createdAt: '2024-06-05T08:00:00Z',
    updatedAt: '2024-06-08T16:00:00Z',
  },
];

const mockNotifications: ClientNotification[] = [
  { id: 'notif_001', type: 'info', title: 'Project Update', message: 'E-commerce Platform: Backend Development milestone is now overdue', read: false, link: '/client/projects/proj_001', createdAt: '2024-06-10T08:00:00Z' },
  { id: 'notif_002', type: 'success', title: 'Payment Received', message: 'Invoice #INV-2024-002 has been paid successfully', read: false, link: '/client/invoices/inv_002', createdAt: '2024-04-12T10:00:00Z' },
  { id: 'notif_003', type: 'warning', title: 'Invoice Due Soon', message: 'Invoice #INV-2024-003 is overdue. Please arrange payment.', read: true, link: '/client/invoices/inv_003', createdAt: '2024-05-16T08:00:00Z' },
  { id: 'notif_004', type: 'info', title: 'New Milestone', message: 'Testing & Optimization milestone is approaching for Mobile App', read: true, link: '/client/projects/proj_003', createdAt: '2024-06-01T10:00:00Z' },
  { id: 'notif_005', type: 'success', title: 'Project Completed', message: 'Data Migration project has been successfully completed', read: true, link: '/client/projects/proj_004', createdAt: '2024-03-31T17:00:00Z' },
  { id: 'notif_006', type: 'info', title: 'Support Ticket Update', message: 'Your ticket TKT-2024-001 has a new response', read: false, link: '/client/support/ticket_001', createdAt: '2024-06-10T10:30:00Z' },
  { id: 'notif_007', type: 'error', title: 'Payment Failed', message: 'Payment for invoice #INV-2024-004 could not be processed', read: true, link: '/client/invoices/inv_004', createdAt: '2024-05-20T08:00:00Z' },
];

const mockProfile: ClientProfile = {
  id: CLIENT_ID,
  name: 'Acme Corporation',
  email: 'client@foundryone.com',
  phone: '+1 (555) 123-4567',
  company: 'Acme Corporation',
  address: '123 Business Ave, Suite 100',
  city: 'San Francisco',
  country: 'USA',
  postalCode: '94105',
  taxId: 'US-987654321',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

const mockNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  invoiceReminders: true,
  projectUpdates: true,
  supportUpdates: true,
  marketingEmails: false,
};

const clientService = {
  async getProjects(clientId: string): Promise<ClientProject[]> {
    await delay();
    return mockProjects.filter((p) => p.clientId === clientId);
  },

  async getProject(clientId: string, projectId: string): Promise<ClientProject | null> {
    await delay();
    const project = mockProjects.find((p) => p.id === projectId && p.clientId === clientId);
    return project || null;
  },

  async getProjectMilestones(clientId: string, projectId: string): Promise<ClientMilestone[]> {
    await delay(300);
    const project = mockProjects.find((p) => p.id === projectId && p.clientId === clientId);
    if (!project) return [];
    return project.milestones.sort((a, b) => a.order - b.order);
  },

  async getProjectTeam(clientId: string, projectId: string): Promise<ClientTeamMember[]> {
    await delay(300);
    const project = mockProjects.find((p) => p.id === projectId && p.clientId === clientId);
    if (!project) return [];
    return project.team;
  },

  async getProjectActivity(clientId: string, projectId: string): Promise<ClientActivity[]> {
    await delay(300);
    const project = mockProjects.find((p) => p.id === projectId && p.clientId === clientId);
    if (!project) return [];
    return project.recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getContracts(clientId: string): Promise<ClientContract[]> {
    await delay();
    return mockContracts.filter((c) => c.clientId === clientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getContract(clientId: string, contractId: string): Promise<ClientContract | null> {
    await delay();
    const contract = mockContracts.find((c) => c.id === contractId && c.clientId === clientId);
    return contract || null;
  },

  async getInvoices(clientId: string, filters?: { status?: InvoiceStatus; search?: string }): Promise<ClientInvoice[]> {
    await delay();
    let invoices = mockInvoices.filter((inv) => inv.clientId === clientId);
    if (filters?.status) {
      invoices = invoices.filter((inv) => inv.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      invoices = invoices.filter((inv) => inv.invoiceNumber.toLowerCase().includes(q) || inv.projectName.toLowerCase().includes(q));
    }
    return invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getInvoice(clientId: string, invoiceId: string): Promise<ClientInvoice | null> {
    await delay();
    const invoice = mockInvoices.find((inv) => inv.id === invoiceId && inv.clientId === clientId);
    return invoice || null;
  },

  async getPayments(clientId: string, filters?: { startDate?: string; endDate?: string }): Promise<ClientPayment[]> {
    await delay();
    let payments = mockPayments.filter((p) => p.clientId === clientId);
    if (filters?.startDate) {
      payments = payments.filter((p) => new Date(p.date) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      payments = payments.filter((p) => new Date(p.date) <= new Date(filters.endDate!));
    }
    return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createPayment(clientId: string, data: CreatePaymentData): Promise<ClientPayment> {
    await delay(600);
    const invoice = mockInvoices.find((inv) => inv.id === data.invoiceId && inv.clientId === clientId);
    if (!invoice) throw new Error('Invoice not found');
    const payment: ClientPayment = {
      id: `pay_${Date.now()}`,
      invoiceId: data.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      projectId: invoice.projectId,
      projectName: invoice.projectName,
      amount: data.amount,
      currency: invoice.currency,
      method: data.method,
      status: 'processing',
      transactionId: data.transactionId,
      date: new Date().toISOString().split('T')[0],
      notes: data.notes,
      clientId,
    };
    mockPayments.push(payment);
    return payment;
  },

  async getTickets(clientId: string): Promise<ClientSupportTicket[]> {
    await delay();
    return mockTickets.filter((t) => t.clientId === clientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTicket(clientId: string, ticketId: string): Promise<ClientSupportTicket | null> {
    await delay();
    const ticket = mockTickets.find((t) => t.id === ticketId && t.clientId === clientId);
    return ticket || null;
  },

  async createTicket(clientId: string, data: CreateTicketData): Promise<ClientSupportTicket> {
    await delay(600);
    const ticket: ClientSupportTicket = {
      id: `ticket_${Date.now()}`,
      ticketNumber: `TKT-2024-${String(mockTickets.length + 1).padStart(3, '0')}`,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      clientId,
      messages: [
        { id: `msg_${Date.now()}`, ticketId: `ticket_${Date.now()}`, authorId: clientId, authorName: 'Client User', authorRole: 'client', content: data.message, attachments: [], createdAt: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTickets.push(ticket);
    return ticket;
  },

  async addTicketMessage(ticketId: string, content: string, authorId: string, authorName: string, authorRole: string): Promise<SupportMessage> {
    await delay(400);
    const ticket = mockTickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    const message: SupportMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      authorId,
      authorName,
      authorRole,
      content,
      attachments: [],
      createdAt: new Date().toISOString(),
    };
    ticket.messages.push(message);
    ticket.updatedAt = new Date().toISOString();
    return message;
  },

  async getNotifications(clientId: string): Promise<ClientNotification[]> {
    await delay();
    return mockNotifications.filter((n) => true).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationRead(clientId: string, notificationId: string): Promise<void> {
    await delay(200);
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  async markAllNotificationsRead(clientId: string): Promise<void> {
    await delay(300);
    mockNotifications.forEach((n) => { n.read = true; });
  },

  async getUnreadNotificationCount(clientId: string): Promise<number> {
    await delay(200);
    return mockNotifications.filter((n) => !n.read).length;
  },

  async getProfile(clientId: string): Promise<ClientProfile | null> {
    await delay();
    return mockProfile;
  },

  async updateProfile(clientId: string, data: UpdateProfileData): Promise<ClientProfile> {
    await delay(500);
    Object.assign(mockProfile, data, { updatedAt: new Date().toISOString() });
    return { ...mockProfile };
  },

  async getNotificationPreferences(clientId: string): Promise<NotificationPreferences> {
    await delay(300);
    return { ...mockNotificationPreferences };
  },

  async updateNotificationPreferences(clientId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    await delay(500);
    Object.assign(mockNotificationPreferences, preferences);
    return { ...mockNotificationPreferences };
  },

  async changePassword(clientId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    await delay(500);
    if (currentPassword === 'Client@123') {
      return { success: true };
    }
    throw new Error('Current password is incorrect.');
  },
};

export default clientService;
