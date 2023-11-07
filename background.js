chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchUdemyData") {
    const { courseName } = message;

    // Fetch Udemy data asynchronously and send the Promise to the popup script
    const dataPromise = getCreationDate(courseName);
    sendResponse(dataPromise); // Send the dataPromise object
  }
});
async function getCreationDate(courseName) {
  try {
    const response = await fetch(
      `https://www.udemy.com/api-2.0/courses/${courseName}/?fields[course]=created`
    );
    const data = await response.json();
    const date = new Date(data.created).toLocaleDateString();
    console.log(`This course was created on ${date}`);
    return Promise.resolve(date); // Wrap the date in a Promise
  } catch (error) {
    console.error("Error fetching Udemy data:", error);
    throw error; // Re-throw the error so the popup script can catch it
  }
}
