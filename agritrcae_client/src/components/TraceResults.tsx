import {
  IBacktrace,
  IProductItem,
  IStakeholderInfo,
} from "@/types/Transaction";
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
import { GiCardDraw, GiMilkCarton, GiTruck } from "react-icons/gi";
import { FaSellsy } from "react-icons/fa";
import { TbMilk } from "react-icons/tb";
import { IRawMaterial } from "@/types/Contracts";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface TraceInfo {
  serial_no: number | string;
  stakeholderInfo: IStakeholderInfo;
  backtraceInfo: IBacktrace;
  productItem: IProductItem;
  rawMaterials: IRawMaterial[];
}

const TraceResults = ({
  serial_no,
  stakeholderInfo,
  backtraceInfo,
  productItem,
  rawMaterials,
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
          date={timeAgo.format(
            new Date(productItem?.timestamp ?? 0),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<TbMilk />}
        >
          <Heading>Product Details</Heading>
          <Text>Product Name: {productItem?.name}</Text>
          <Text>
            Added At:{" "}
            {timeAgo.format(
              new Date(productItem?.timestamp ?? 0),
              "twitter-now"
            )}
          </Text>
          <Text>
            Product Description: {productItem?.quantity}{" "}
            {productItem?.quantityUnits}
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date={timeAgo.format(
            new Date(backtraceInfo.entityTransactions[0].createdAt ?? 0),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<GiCardDraw />}
        >
          <Heading>Raw Materials Supplier Info</Heading>
          <Text>Supplier Name: {stakeholderInfo?.supplier?.name}</Text>
          <Text>Supplier Address: {stakeholderInfo?.supplier?.address}</Text>
          <Text>Supplier Location: {stakeholderInfo?.supplier?.location}</Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date={timeAgo.format(
            new Date(rawMaterials[0].timestamp ?? 0),
            "twitter-now"
          )}
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<GiTruck />}
        >
          <Heading>Product Raw Materials Utilized</Heading>
          {rawMaterials.map((rawMaterial) => (
            <Text>
              {rawMaterial.name} : {rawMaterial.quantity}{" "}
              {rawMaterial.quantityUnit}
            </Text>
          ))}
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
