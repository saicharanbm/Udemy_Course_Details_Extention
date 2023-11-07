const udemyDataElement = document.getElementById("udemy-data");
const courseDateElement = document.getElementById("course-date");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  if (tabs && tabs.length > 0) {
    let url = tabs[0].url;
    const regex =
      /[a-zA-Z]+:\/\/[a-zA-Z]+.udemy.com\/course\/[a-zA-Z0-9\/-]*\//;
    const isInUdemyCourse = regex.test(url);
    if (isInUdemyCourse) {
      const pathSegments = new URL(url).pathname.split("/");

      // The "chrome-extension" part should be the third segment in this example.
      const courseName = pathSegments[2];
      udemyDataElement.textContent = `Udemy Course ${courseName} Creation Date:`;
      console.log(courseName);
      getCreationDate(courseName).then((res) =>
        console.log((courseDateElement.textContent = res))
      );
      // Send a message to the background script to fetch Udemy data
      //   chrome.runtime.sendMessage(
      //     { action: "fetchUdemyData", courseName },
      //     (response) => {
      //       console.log(response);
      //       response
      //         .then((date) => {
      //           console.log(`This course was created on ${date}`);
      //         })
      //         .catch((error) => {
      //           console.error("Error fetching Udemy data:", error);
      //         });
      //     }
      //   );
    } else {
      udemyDataElement.textContent = `please visit an Udemy Course site.`;
    }
  } else {
    console.log("No active tabs found in the last focused window.");
  }
});

async function getCreationDate(courseName) {
  try {
    const response = await fetch(
      `https://www.udemy.com/api-2.0/courses/${courseName}/?fields[course]=https://www.udemy.com/api-2.0/courses/freelance-web-design-from-design-to-development-to-making-money/?fields[course]=title,image_125_H,num_subscribers,avg_rating,avg_rating_recent,rating,num_reviews,num_reviews_recent,created`
    );
    const data = await response.json();
    const date = new Date(data.created).toLocaleDateString();
    console.log(`This course was created on ${data.image_125_H}`);
    return Promise.resolve(date); // Wrap the date in a Promise
  } catch (error) {
    console.error("Error fetching Udemy data:", error);
    throw error; // Re-throw the error so the popup script can catch it
  }
}
