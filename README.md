### SUT: Fakeflix

Link to original repo: https://github.com/Th3Wall/Fakeflix

### Team member:

Yisheng Zhu, yzhu186

Yulun Zeng, yzeng33

Zichen Fu, zfu16

### Testing Tools

1. Vitest: a fast, Vite-native testing framework for JavaScript and TypeScript projects, offering Jest-compatible APIs, built-in coverage, and instant feedback with modern ESM support. We used this to perform **blackbox unit tests** on the hook functions.

- Test path: ./vitest
- Report path: ./vitest-report

2. Playwright

- Test path: ./e2e
- Report path: ./playwright-report
- The report only contains the report page. The "data" folder is not included in the repo due to the size. So cannot see the video recording of failedtest cases.

3. Jest: Light weight testing library for JavaScript project, has built-in coverage metrics and has powerful mocking and assertion capability. We used Jest for whitebox unit testing, on redux global state management of the system to ensure data is stored and transformed correctly. We used mocking and stubbing extensively throughout the test cases because Jest does not work well when there are third party library dependencies.

- Test path: src/\**/*whitebox.test.js
- Report path: ./jest-coverage

### Running Instructions

- For Vitest Blackbox unit tests:

  - Running command: `pnpm test:unit:report`
  - Expected running time: 2.57s
  - Expected outcome: `Tests  14 failed | 26 passed (40)` (failure reasons are documented below)

- Test path: TODO
- Report path:

3. Jest: Light weight testing library for JavaScript project, has built-in coverage metrics and has powerful mocking and assertion capability. We used Jest for whitebox unit testing, on redux global state management of the system to ensure data is stored and transformed correctly. We used mocking and stubbing extensively throughout the test cases because Jest does not work well when there are third party library dependencies.

- Test path: src/\**/*whitebox.test.js
- Report path: ./jest-coverage

### Running Instructions

- First run `npm install` to install dependencies.
- For Vitest Blackbox unit tests:

  - Running command: `npm run test:unit:report`
  - Expected outcome:
    ```
    Tests  14 failed | 26 passed (40)
    ```
    (failure reasons are documented below)

- For Playwright integration test and GUI tests:

  - Running Command: To run the GUI tests, we need to start the app first.
    - `npm run start`
    - `npm run test:e2e`
  - Expected running time: 10 mintes (with 6 workers) and plus (depends on the performance of the machine)
  - Expected outcome: 2 failed tests out of 231 tests (due to the some unstable tests, some testcases will fail if using multiple workers, but it will pass if using single worker. Details are documented below)

- For Jest whitebox unit tests:
  - Running command `npm run test:coverage`
  - Expected outcome:
    ```
    Tests: 74 failed, 344 passed, 418 total
    ```

### Clarification on failures we found

1. From Vitest unit testing:

- Hook `useGenreConversion` assumes the input genreIds is always a valid array, leading to crashes (Cannot read properties of undefined/null) when undefined, null, or wrong types like strings are passed. This lack of defensive programming poses a critical stability risk. Additionally, the hook silently slices the input array to only the first three elements, which caused unexpected results when duplicated genre IDs were tested—this behavior is intentional but not clearly documented. Overall, the tests correctly exposed that the hook is fragile against invalid inputs and silently trims user data, and the hook needs input validation and clearer behavior documentation to ensure robustness.

```Error logs
   × BA: undefined input returns empty array 7ms
     → Cannot read properties of undefined (reading 'slice')
   × BA: null input returns empty array 1ms
     → Cannot read properties of null (reading 'slice')
   × BA: invalid type (string) returns empty array 1ms
     → genreIds.slice(...).map is not a function
```

- Hook `useOutsideClick` assumes that ref.current is always available and valid, but when it is null or improperly attached, the hook's event listener either silently fails or never triggers onClose, leading to missed outside clicks. Additionally, the event listener does not robustly detect multiple outside clicks across events, suggesting improper binding or conditional logic that depends too strictly on the presence of a valid DOM node. A well-designed useOutsideClick should tolerate null refs, consistently attach and clean up event listeners, and correctly fire onClose even in dynamic or edge-case scenarios, which the current implementation does not fully achieve.

```Error logs
× EG: multiple outside clicks only call onClose once per event 2ms
    → expected "spy" to be called 3 times, but got 0 times
× BA: does not crash if ref is null 2ms
    → expected "spy" to be called at least once
```

- Hook `useRetrieveCategory` has all tests failed on the error. The failures occur because the hook does not defensively handle cases where `selectedConfigArray` is null or undefined. In the current implementation, the hook immediately tries to call `.filter` on `selectedConfigArray` without verifying that it is a valid array. This leads to runtime errors when the Redux store does not provide a properly initialized array, which can happen during early rendering or in edge cases tested intentionally.

```Error log
 → Cannot read properties of null (reading 'filter')
```

- Hook `useRetrieveData` fails because it incorrectly assumes a valid array will always be returned, while the tests correctly explore invalid, null, and undefined scenarios that the hook does not currently defend against.

2. From Playwright integration testing and GUI Testing:

- Overview: GUI testing is conducted by two parts:
  - Pages: Ensure the pages are rendered correctly, all the elements are visible correctly. This application contains this main page: login page, home page, movie page, TV&News page, popular page, and my list page.
  - Components (in combination of integration test): Ensure the components are workig as expected after some interactions. This part mainly focus on the interaction with the components and the response of the components.
- Challenges: Since this is a web application focus on visual effects, it contains a lot of animations and transitions. Sometimes the animation might be blocked by the network latency. In this case, the fixed timeout might not be enough to wait for the animation to complete. Also, because of the rate limit of the API, the testcases will fail if the API is called too frequently in a short period of time. This usually happens when playwright running multiple workers on different browsers engine.
- Failed Testcases: regardless the unstable network and the perfomance of animations, two testcases detected the fault in the code:
  - The misuse of "type" of input element in login and signup page. For the email input, the input has the type "text", but the testcases expect the input to be "email". Even though the validation of form will examine the input to be correct email address, the testcases will fail because of the type mismatch. It will be better to use "email" as the type of the input. This will make the form validation more robust and reliable.
  - Failure to transit the icon after adding media into my favorite list. On the poster element, row poster element, and detail dialog of poster, a "plus" button is used to add the media into my favorite list. However, the testcases expect the icon to be a "minus" icon, but it actually stays as a "plus" icon. This will cause confusion to the users. In this case, users will not sure whether the media is in the favorite list or not.

3. From Jest Whitebox Testing:

- In the beginning, we focused on statement and branch coverage, which did not yield any useful hint of the the underlying fault. After achieving 100% coverage on the targeted files, we decided to test with invalid inputs, such as providing empty array or `undefined` values to functions. As a result, the faults started appearing. Here is a list of the prominant failures we revealed:

  - Selectors › returns undefined when state is undefined
  - Selectors › returns undefined when movies slice is missing
  - Selectors › returns undefined when specific genre slice is missing
  - addToFavouritesUtil › does not add if favouritesList is undefined
  - addToFavouritesUtil › does not add if favouriteToAdd is undefined
  - removeFromFavouritesUtil › returns empty list if favouritesList is undefined
  - removeFromFavouritesUtil › does not remove if favouriteToRemove is undefined
  - favourites action creators › removeFromFavourites › should throw when called with undefined
  - favourites action creators › addToFavourites › should throw when called with undefined
  - firebaseUtils bootstrap › environment variables are set

Notice how almost all of the failures we found were related to undefined values or missing data. We verified our findings against the actual code, and indeed the original functions lack a sanity check for the edge cases. In React Redux, developers often have to write duplicated code when different categories of data follow the same structure or respond to action calls the same way, therefore, the faults quickly spread in the codebase, resulting in multiple functions to inherit the same fault.

The last fault that is related to firebase was a test to see if the envrionment variables are set up correctly. The codebase is technically able to access all defined envrionment variables, except that there is a small typo that spellds `...MEMT` instead of `...MENT`.
