const udemyDataElement = document.getElementById("udemy-data");
const courseDateElement = document.getElementById("course-date");
const updateDateElement = document.getElementById("update-date");
const courseThumbnail = document.getElementById("course_thumbnail");
const recent_count = document.getElementById("rating-count");
const rating_count = document.getElementById("recent-count");
const totalRating = document.getElementById("total-rating");
const latestRating = document.getElementById("latest-rating");
const courseDetails = document.getElementById("course-details");
const container = document.getElementById("container");
// // Set the linear gradient background
// ratingStar1.style.background =
//   "linear-gradient(to right, #ffcc00 50%, #ccc 50%)";

// // Set the text to be transparent
// ratingStar1.style.color = "transparent";

// // Add the -webkit-background-clip for webkit browsers
// ratingStar1.style.webkitBackgroundClip = "text";

document.getElementById("closeButton").addEventListener("click", function () {
  window.close();
});

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

      console.log(courseName);
      getCreationDate(courseName).then(updatedata);
      function updatedata(data) {
        const {
          created,
          title,
          image_240x135,
          last_update_date,
          avg_rating_recent,
          avg_rating,
          num_reviews,
          num_reviews_recent,
        } = data;
        const date = new Date(created).toLocaleDateString();
        const updateDate = new Date(last_update_date).toLocaleDateString();
        courseDetails.style.display = "block";
        udemyDataElement.textContent = title;
        courseDateElement.textContent = `Created: ${date}`;
        updateDateElement.textContent = `Last Update: ${updateDate}`;
        recent_count.textContent = `No of Recent Rating : ${num_reviews_recent}`;
        rating_count.textContent = `No of Rating : ${num_reviews}`;
        totalRating.textContent = String(avg_rating).substring(0, 3);
        latestRating.textContent = String(avg_rating_recent).substring(0, 3);

        courseThumbnail.src = image_240x135;
        for (let i = 1; i <= 5; i++) {
          const ratingStar = document.getElementById(`rating_star${i}`);

          if (avg_rating >= i) {
            ratingStar.style.color = "#f69c07";
          } else if (avg_rating >= i - 1) {
            const fraction = (avg_rating - (i - 1)) * 100;
            ratingStar.style.background = `linear-gradient(to right, #f69c07 ${fraction}%, #ccc ${fraction}%)`;

            // Set the text to be transparent
            ratingStar.style.color = "transparent";

            // Add the -webkit-background-clip for webkit browsers
            ratingStar.style.webkitBackgroundClip = "text";
          } else {
            ratingStar.style.color = "#ccc";
          }
        }
        for (let i = 1; i <= 5; i++) {
          const ratingStar = document.getElementById(`latest_star${i}`);

          if (avg_rating_recent >= i) {
            ratingStar.style.color = "#f69c07";
          } else if (avg_rating_recent >= i - 1) {
            const fraction = (avg_rating_recent - (i - 1)) * 100;
            ratingStar.style.background = `linear-gradient(to right, #f69c07 ${fraction}%, #ccc ${fraction}%)`;

            // Set the text to be transparent
            ratingStar.style.color = "transparent";

            // Add the -webkit-background-clip for webkit browsers
            ratingStar.style.webkitBackgroundClip = "text";
          } else {
            ratingStar.style.color = "#ccc";
          }
        }
      }
    } else {
      courseDetails.style.display = "none";
      container.style.height = "210px";
      courseThumbnail.src = "error.svg";
      udemyDataElement.textContent = `please visit an Udemy Course page.`;
    }
  } else {
    console.log("No active tabs found in the last focused window.");
  }
});

async function getCreationDate(courseName) {
  try {
    const response = await fetch(
      `https://www.udemy.com/api-2.0/courses/${courseName}/?fields[course]=https://www.udemy.com/api-2.0/courses/freelance-web-design-from-design-to-development-to-making-money/?fields[course]=id,image_240x135,num_subscribers,avg_rating,avg_rating_recent,rating,num_reviews,num_reviews_recent,created,title,last_update_date`
    );
    const data = await response.json();
    // const date = new Date(data.created).toLocaleDateString();
    // console.log(`This course was created on ${data.image_240x135}`);
    return Promise.resolve(data); // Wrap the date in a Promise
  } catch (error) {
    console.error("Error fetching Udemy data:", error);
    throw error; // Re-throw the error so the popup script can catch it
  }
}
