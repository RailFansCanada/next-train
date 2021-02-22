import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format, add } from "date-fns";

type Direction = "arrival" | "departure";

const urlParams = new URLSearchParams(window.location.search);
const selectedDirection: Direction =
  (urlParams.get("direction") as Direction) ?? "departure";

const getData = async (direction: Direction) => {
  // Use Cyrville for arrivals
  const stop = direction === "arrival" ? "3026" : "3027";

  const result = await fetch(
    `/v2.0/GetNextTripsForStop?appID=${process.env.REACT_APP_APP_ID}&apiKey=${process.env.REACT_APP_API_KEY}&stopNo=${stop}&routeNo=1&format=json`,
    {}
  );

  const data = await result.json();

  if (data.GetNextTripsForStopResult.Error !== "") {
    return [];
  }

  const routes: any = data.GetNextTripsForStopResult.Route.RouteDirection;
  let route;
  // Sometimes it's an array, sometimes it's not...
  if (Array.isArray(routes)) {
    route = routes.find((r) => {
      if (direction === "arrival") {
        return r.RouteLabel === "Blair";
      } else {
        return r.RouteLabel === "Tunney's Pasture";
      }
    });
  } else {
    route = routes;
  }

  if (route?.Trips == null) {
    return [];
  }

  let trips: any[] = route.Trips.Trip;
  if (!Array.isArray(trips)) {
    trips = [trips];
  }

  if (direction === "departure") {
    return trips.map((trip) => parseInt(trip.AdjustedScheduleTime));
  } else {
    // Add 3 minutes of travel time from Cyrville to Blair
    return trips.map((trip) => parseInt(trip.AdjustedScheduleTime) + 3);
  }
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #cc0000;
  color: #ffffff;
  width: 100vw;
  height: 100vh;
  font-size: 1.2em;
`;

const App = () => {
  const [trips, setTrips] = useState<number[]>([]);
  const [updateTime, setUpdateTime] = useState<Date | null>(null);

  const doUpdate = () => {
    getData(selectedDirection)
      .then((result) => {
        setTrips(result);
        setUpdateTime(new Date());
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    doUpdate();
  }, []);

  useEffect(() => {
    let timeout = 3 * 60000; // Default 3 minute timeout
    if (trips.length > 0) {
      timeout = (trips[0] + 1) * 60000;
    }

    setTimeout(() => {
      doUpdate();
    }, timeout);
  }, [trips]);

  if (updateTime != null && trips.length > 0) {
    return (
      <Container>
        Next {selectedDirection === "arrival" ? "Arrival" : "Departure"}:{" "}
        {format(add(updateTime, { minutes: trips[0] }), "HH:mm")}
      </Container>
    );
  } else {
    return (
      <Container>
        No Scheduled{" "}
        {selectedDirection === "arrival" ? "Arrivals" : "Departures"}
      </Container>
    );
  }
};

export default App;
