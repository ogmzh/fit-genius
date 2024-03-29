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
- [x] search users by name on the client list screen

## Client profiles

- [x] tabbed header component
- [x] make tabbed header component show only for an existing user
- [x] add amount of workouts to the client
  - [x] fix the query not refetching useUser(byId) after we invalidate the query adding the workout values
- [x] add a boolean to the client payment saying they want solo workouts
- [x] show numbers of workouts remaining for the user on the appointment selection
- [x] create a filter button section on appointments to filter solo, group and all users (hide the ones that have 0 workouts left by default)
- [x] select a single user for a solo workout (if they ave solo workouts remaining)
- [ ] client profile: add measurements
- [x] handle possibility of one payment update query failing and rollback the previous one

### consider:

- [ ] if we have an appointment taken by the solo user, prevent|warn it from being picked
  - [ ] time picker should not let us pick non-working time

## Exercises

- [ ] tab for exercises
  - [ ] exercise should have a name, tags (push, pull, chest, back etc), type (reps or duration), and a link to a video
- [ ] create exercises
- [ ] list exercises
- [ ] update an exercise
- [ ] delete an exercise

## Workouts

- workout is a specific set of exercises for a client on a given day
- refine tasks
- 1:1 relationship with an appointment ?? or just dump exercises into an appointment ??

## UI

- [x] seriously consider going for RNUI lib | tamagui
- [x] refactor appointment-form and client-user-list user-cards to a component
- [x] refactor appointment-form and client-user-list form buttons to a component
- [x] refactor time picker to a component
- [x] sheet to reusable component with multiple snap points
- [x] scale the time picker so we can use it in our sheet
- [ ] implement an input chips component

## Bugs

- [ ] date picker is always preselected on "today" instead on selected
