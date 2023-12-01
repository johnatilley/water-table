# Water Table!

## Solution Quick Start

(Visit https://www.johntilley.dev if you don't want to set up a local copy)

Run these commands to get the app running

```
git clone git@github.com:johnatilley/water-table.git
npm install
cp .env.example .env
```

Add your mapbox api key to .env in REACT_APP_MAP_BOX_API_KEY and then you're ready to start the service

```
npm run dev
```

Now visit http://localhost:3000

## The brief

Our satellite products are used across the world for environmental, industrial and IoT applications; in many cases they're used to periodically capture and transmit remote sensor data. Typical monitoring applications include: oil/gas pipelines, glaciers, oceanic buoys and river sensors.


We're looking for a new screen to present and visualise the data from such a sensor; it should be both highly functional and look great too!


**Key Requirements**
* Consume JSON sample data and decode sensor data
* Present the data in tabular form; with appropriate:
  * Formatting/styling for data types
  * Arrangement and presentation
  * Search/filtering capabilities
  * UI performance for data size
  * Cross browser and screen size considerations
* Visualise the “sensor” data
  * Impress us by visualising some/all of the sensor data

You'll be assessed on your code quality, visual presentation and attention to detail - it's okay to use external dependencies, but we expect to see sufficient original work to be able to assess your abilities!

## The Solution

### Examining the task

Looking at the data I saw some gobbledygook that I guessed was Base64 encoded. After decoding and reviewing the metrics data I knew I wanted to decode it and insert the full data back into the json object.

During our initial interview we discuss the role as primarily being frontend and the was written in Java. Therefore I chose to approach this task as though the contents of the `river_sensor_data.json` file was the format that would be delivered to us on the frontend.

One of the first things I did in the task was set up a spoof server in node to emulate an api end point.

In an ideal world we would have a more fully fledged api where we could call upon this data in smaller chunks. There are 10,000 records in the file and it is over 5 megabytes in size.

With being forced to download the data in full I opted to include a progress bar to display how far the download had gotten. People need feedback from UIs so for users on 3G or slower we need to display this information.

There is some upside to fully front-loading the data. It means when we do filtering later on in the system the user won't have to wait any more for more data calls, which means fewer loading icons. As the data is historical we could alleivate some pain points by storing the json data in local storage, although this is not something I have done for this task.

###  Npm and create-react-app

I decided to return to basics and keep everything simple. This way when someone comes to assess this task I won't be forcing them to download binaries they may not have. For this reason I did all my node_module installations using good ol' npm. I am running Node 20 with npm 10.

Typically in a system set up some docker containers. Again I didn't do this due to not knowing whether the assessor(s) would be running docker on their own machines.

Keeping things simple was also the reason I chose to go back to basics and use create-react-app and react-scripts. I was tempted to implement a server side rendering framework like Next or Remix but decided against it.

Additionally in terms of compilation I was tempted to explore Vite in more detail but sticking to react-scripts mean less tooling and more compatibility with unknown devs who may need to review this work.

### Tailwind and DaisyUI

I have never built a website without writing any css before and for no particuar reason I thought I'd attempt a css-less website build for this task.

DaisyUI is an opinionated component library that works as a plugin for Tailwind. I would argue it completes Tailwind into a classic css framework like the ones you'd find in the Bootstrap/Foundation era.

DaisyUI brings a lot of components such as buttons and various inputs with similar class names like `btn` and `card`. It also brings a colour palette system allowing us to define Primary, Secondary, Accent and Base colours for our theme.

This is especially useful for theme switching which is also a feature I included as a light mode/dark mode switch. This is completely driven by DaisyUI using their premade themes. I highly promote the use of dark mode themes because it means designers have to do their job twice. 🙃

Design wise the system is mobile first, which is useful due to Tailwind's mobile first nature. Although in reality the desktop version was assembled first and then classes retroactively have sm: or md: added to them.

### Logo and Favicon

I just wanted to make the site look more authentic and add these for the sake of completion.

To me Full Stack development isn't just code. It extends beyond the abstraction into image manipulation and video editing tools. Having knowledge of graphics is important when it comes to the web.

### useContext

I took a modular approach with the `SensorViewer` module occupying a self contained folder. The idea here is to add another module, say UserManagement module, we can confine the logic for that module to another self-contained folder. So if the single folder inside modules looks weird that is the reason. Even though this task has it's limits I think it's valuable to practice implementing an extensible structure.

"State management" is kept in the entry point in `SensorViewer.js`. Rather than building out a global store using Redux I decided to set up `useContext` to pass the state in the module's sub-components. `useContext` isn't really a state management hook, it's just a means of avoiding prop drilling.

In hindsight this was unnecessary as the module ended up being more shallow than I had anticipated and the state could have easily just been passed down through props.

At least it kind of keeps the return() statement relatively clean? ¯\\_(ツ)_/¯

### Loading > Filtering > Sorting

You may notice that the data is copied multiple times. The paradigm I use is to keep a copy of the full data in a `downloadedData` array. This is used by the filtering to produce a `filteredData` array, which in turn is used by the sorting and pagination to produce the final table.

This may seem like a lot but keeping a copy at each level is useful. `filteredData` lets us know how many pages are available for pagination. When we want to sort the data we don't need to rerun the filtering.

This also helps us get closer to single responsibility principle. Each `useEffect` only needs to focus on doing one treatment (which you already know is bs because the third level does both Sorting and Pagination. I said gets us closer! CLOSER! Not all the way!)

### Filters

I never fully worked out the data in full before I started. I was mostly discovering it as I went. It wasn't until I started filering that I realised there were only 5 different sets of sensor data.

Ideally the sensor selector would be visible at all times and not be tucked away inside a drawer, especially for the map view which requires users to open the filter panel before viewing the data.

It's actually quite annoying switching to the map view tab and having to open another panel to get the map to show. With more time I would love to explore a better way to do this. Perhaps choosing a Sensor ID to review before seeing any data would have been better.

### Water Table user flow

Displaying the data opened up the challenge of where to show all the extra payload information. To avoid making the table too wide I opted for a hover over panel, which I think helps make the system a little bit more interactive.

I also went a bit overboard and built in a column customisation system, but this would come into play for the mobile version to prevent covering the screen with the hover over panel. Users can click `Add Columns +` to add more data to the table and remove them.

### Maps!

I opted for MapBox to drive my map view as I've used it extensively in the past.

At the start I knew I wanted to do something map based with the data and I knew I wanted to do something related to the timestamps. I took some inspiration from the weather maps that show a timeline of the radar data.

To do this I wrote some logic to convert all the payload data into an average for each metric for each month and then had a `Range Input` select which month to show. This allows the user to see the averages change over time.

I don't know how useful averages really are, but hey it looks pretty cool!

### Ideas

As I said at the start of this write up, it would be really good to have done some work server side to treat the data into an apporiate format, such as decoding the payload and sorting the data. Given more time I would have explored that in more detail.

Currently the application does a lot of looping through the data on the client machine just to get the right format, but then again at least we save on our AWS bill by not running so many routines!
