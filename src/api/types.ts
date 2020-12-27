export interface Properties { [key: string]: string }
export interface Attributes { [key: string]: string }
interface Elem {
  properties?: Properties;
  attributes?: Attributes;
}

export interface KdenliveJS {
  attributes: {
    LC_NUMERIC: string;
    producer: string;
    version: string;
    root: string;
  };
  profile: Profile;
  producers: {
    [key: string]: Producer;
  };
  main_bin: Mainbin;
  timeline: Timeline;
}

export interface Profile {
  width: string;
  height: string;
  frame_rate_num: string;
  description: string;
  sample_aspect_num: string;
  display_aspect_den: string;
  colorspace: string;
  progressive: string;
  display_aspect_num: string;
  frame_rate_den: string;
  sample_aspect_den: string;
  [key: string]: string
}

export interface Mainbin {
  entries: {
    in: string,
    out: string,
    producer: string
  }[];
  properties: Properties;
}

export interface Producer extends Elem {
  name: string;
  in: string;
  out: string;
}

export interface Timeline {
  name: "tractor";
  in: string;
  out: string;
  global_feed: "1";
  tracks: Track[];
  transitions?: Transition[];
  filters?: Filter[];
}

export interface Track extends Elem {
  name: string;
  entries?: Entry[];
  filters?: Filter[];
  transitions?: Transition[];
}

export interface Entry extends Elem {
  in: string;
  out: string;
  producer: string;
  refID: string;
}

export interface Filter extends Elem {
    id: string;
}

export interface Transition extends Elem {
    id: string;
}  