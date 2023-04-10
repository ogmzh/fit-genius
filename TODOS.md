## New appointment

- [x] clicking day on appointments should pop out date pick
- [x] should include timezone when selecting time for appointment
- [x] long press timeline hour to create appointment

## Appointments screen

- [x] show individual events
- [x] refactor the existing form to tamagui
- [x] change the date of birth picker component
  - [ ] implement rn datepicker it for iOS as well; use the component approach (https://github.com/react-native-datetimepicker/datetimepicker )
- [x] change the query to fetch all the appointments for the month and make it a long lasting query
- [x] reimplement create appointment screen
- [x] fix a bug on appointment card time being AM/PM wrong
- [x] change user's appointment date
- [x] change user's appointment time
- [x] if i select an appointment for which i already have users, select them
- [x] if i mark a user that already has an appointment for that day, give a warning
- [x] delete appointments
- [x] search users by name on the new appointment screen

## Client profiles

- [ ] add amount of workouts to the client
- [ ] add a boolean to the client payment saying they want solo workouts
- [ ] if we have an appointment taken by the solo user, prevent it from being picked
  - [ ] make time picker to now allow picking non-working time also
- [ ] client profile: add measurements

## UI

- [x] seriously consider going for RNUI lib | tamagui
- [x] refactor appointment-form and client-user-list user-cards to a component
- [x] refactor appointment-form and client-user-list form buttons to a component
- [x] refactor time picker to a component
- [x] scale the time picker so we can use it in our sheet
