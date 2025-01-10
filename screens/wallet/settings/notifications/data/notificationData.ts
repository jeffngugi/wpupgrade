import { NotificationSectionTypes } from '~types'

export const notificationData: NotificationSectionTypes[] = [
  {
    title: 'Wallet Activity',
    description:
      'Monitor Large Transactions, Troubleshoot payment issues, and more.',
    data: [
      {
        label: 'Incoming transaction alerts',
        id: 'incoming_transaction_limit',
        name: 'incoming_transaction_alert',
        limitName: 'incoming_transaction_limit',
        singular: 'Incoming transaction',
        status: false,
      },
      {
        label: 'Outgoing transaction alerts',
        id: 'outgoing_transaction_alert',
        status: false,
        singular: 'Outgoing transaction',
        name: 'outgoing_transaction_alert',
        limitName: 'outgoing_transaction_limit',
      },
      {
        label: 'Low balance',
        id: 'low_balance_alert',
        status: false,
        singular: 'Low balance',
        name: 'low_balance_alert',
        limitName: 'low_balance_limit',
      },
      {
        label: 'Bill Payment Reminders',
        id: 'bill_payment_alert',
        status: false,
        singular: 'Bill Payment Reminder',
        name: 'bill_payment_alert',
      },
    ],
  },
  {
    title: 'Preffered notification channel',
    description: 'Choose your preffered notification channel for each category',
    data: [
      {
        label: 'Transaction alerts',
        id: 'transaction_alerts',
        name: 'transaction_alerts',
        singular: 'Transaction alert',
        status: false,
        isEditable: true,
        options: [
          {
            label: 'Email',
            value: 'email',
          },
          {
            label: 'SMS',
            value: 'sms',
          },
        ],
      },
      {
        label: 'Low balance',
        id: 'low_balance',
        name: 'low_balance',
        status: false,
        isEditable: true,
        singular: 'Low balance',
        options: [
          {
            label: 'Email',
            value: 'email',
          },
          {
            label: 'SMS',
            value: 'sms',
          },
        ],
      },
    ],
  },
  {
    title: 'Quiet Time',
    description: 'Choose when you want to receive notifications',
    data: [
      {
        label: 'Quiet time',
        id: 'quiet_time',
        name: 'quiet_time',
        status: false,
        singular: 'Quiet time',
        isEditable: true,
        options: [
          {
            label: 'Morning',
            value: 'morning',
          },
          {
            label: 'Afternoon',
            value: 'afternoon',
          },
          {
            label: 'Evening',
            value: 'evening',
          },
        ],
      },
    ],
  },
]
