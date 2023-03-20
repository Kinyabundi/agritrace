import { IBacktrace, IStakeholderInfo } from "@/types/Transaction";
import { IoIosSchool } from "react-icons/io";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { HiTruck } from "react-icons/hi";
import { Heading, Text } from "@chakra-ui/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { GiMilkCarton } from "react-icons/gi";
import { FaSellsy } from "react-icons/fa";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface TraceInfo {
  serial_no: number | string;
  stakeholderInfo: IStakeholderInfo;
  backtraceInfo: IBacktrace;
}

const TraceResults = ({
  serial_no,
  stakeholderInfo,
  backtraceInfo,
}: TraceInfo) => {
  return (
    <div>
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date={timeAgo.format(
            new Date(backtraceInfo.productTransaction.updatedAt),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<HiTruck />}
        >
          <Heading>Product Distribution</Heading>

          <Text>{stakeholderInfo?.distributor?.name}</Text>
          <Text>{stakeholderInfo?.distributor?.address}</Text>
          <Text>
            {stakeholderInfo?.distributor?.location},{" : "}
            {timeAgo.format(
              new Date(backtraceInfo.productTransaction.updatedAt),
              "twitter-now"
            )}
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={timeAgo.format(
            new Date(backtraceInfo.productTransaction.updatedAt),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<FaSellsy />}
        >
          <Heading>
            {backtraceInfo.productTransaction.status === "Initiated"
              ? "Product Sell Initiated"
              : "Product Sell Accepted By Distributor"}
          </Heading>
          <Text>Manufacturer : {stakeholderInfo?.manufacturer?.name}</Text>
          <Text>Address : {stakeholderInfo?.manufacturer?.address}</Text>
          <Text>
            Location : {stakeholderInfo?.manufacturer?.location},{" : "}
            {timeAgo.format(
              new Date(backtraceInfo.productTransaction.updatedAt),
              "twitter-now"
            )}
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={timeAgo.format(
            new Date(backtraceInfo.productTransaction.createdAt),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<GiMilkCarton />}
        >
          <Heading>Product Packaging</Heading>
          <Text>Manufacturer : {stakeholderInfo?.manufacturer?.name}</Text>
          <Text>Address : {stakeholderInfo?.manufacturer?.address}</Text>
          <Text>
            Location : {stakeholderInfo?.manufacturer?.location},{" : "}
            {timeAgo.format(
              new Date(backtraceInfo.productTransaction.createdAt),
              "twitter-now"
            )}
          </Text>
          <Text>
            Product Packaging Date :{" "}
            {new Date(
              backtraceInfo.productTransaction.createdAt
            ).toDateString()}
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2006 - 2008"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<IoIosSchool />}
        >
          <h3 className="vertical-timeline-element-title">Web Designer</h3>
          <h4 className="vertical-timeline-element-subtitle">
            San Francisco, CA
          </h4>
          <p>User Experience, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="April 2013"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<IoIosSchool />}
        >
          <h3 className="vertical-timeline-element-title">
            Content Marketing for Web, Mobile and Social Media
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
          <p>Strategy, Social Media</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="November 2012"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<IoIosSchool />}
        >
          <h3 className="vertical-timeline-element-title">
            Agile Development Scrum Master
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Certification</h4>
          <p>Creative Direction, User Experience, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="2002 - 2006"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<IoIosSchool />}
        >
          <h3 className="vertical-timeline-element-title">
            Bachelor of Science in Interactive Digital Media Visual Imaging
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            Bachelor Degree
          </h4>
          <p>Creative Direction, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
          icon={<IoIosSchool />}
        />
      </VerticalTimeline>
    </div>
  );
};

export default TraceResults;
