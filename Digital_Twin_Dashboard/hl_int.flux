from(bucket: "metrics_bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_field"] == "hl_int")
  |> aggregateWindow(every: 15s, fn: last)  // This will get the last value in each 15s window
  |> yield(name: "hl_int")