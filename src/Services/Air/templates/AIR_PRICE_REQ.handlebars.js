module.exports = `
<!--Release 8.1-->
<!--Version Dated as of 15/Apr/2015 11:24:06-->
<!--Air Pricing For Galileo({{provider}}) with LFS CheckFlightDetails Request-->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header/>
    <soap:Body>
        <air:AirPriceReq
            AuthorizedBy="user" CheckFlightDetails="true" TargetBranch="{{TargetBranch}}"
            TraceId="{{requestId}}"
            {{#if fetchFareRules}}
            FareRuleType="{{#if long}}long{{else}}short{{/if}}"
            {{/if}}
            xmlns:air="http://www.travelport.com/schema/air_v52_0"
            xmlns:com="http://www.travelport.com/schema/common_v52_0">
            <com:BillingPointOfSaleInfo OriginApplication="UAPI" xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
            <air:AirItinerary>
                {{#segments}}
                <air:AirSegment ArrivalTime="{{arrival}}"
                                DepartureTime="{{departure}}"
                                Carrier="{{airline}}"
                                {{#if bookingClass}} ClassOfService="{{bookingClass}}" {{/if}}
                                CabinClass="{{serviceClass}}"
                                Origin="{{from}}"
                                Destination="{{to}}"
                                ETicketability="Yes"
                                Equipment="{{plane}}"
                                FlightNumber="{{flightNumber}}"
                                LinkAvailability="true"
                                PolledAvailabilityOption="Polled avail exists"
                                ProviderCode="{{../provider}}"
                                Key="{{@index}}"
                                Group="{{group}}">
                    {{#if transfer}}
                    <air:Connection/>
                    {{/if}}
                </air:AirSegment>
                {{/segments}}
            </air:AirItinerary>
            {{#if platingCarrier}}
              <air:AirPricingModifiers PlatingCarrier="{{platingCarrier}}"/>
            {{/if}}
            {{#if business}}
            <air:AirPricingModifiers InventoryRequestType="DirectAccess">
                <air:PermittedCabins>
                    <com:CabinClass Type="Business" xmlns:com="http://www.travelport.com/schema/common_v52_0" />
                </air:PermittedCabins>
            </air:AirPricingModifiers>
            {{else}}
            <air:AirPricingModifiers InventoryRequestType="DirectAccess"/>
            {{/if}}
            {{#passengers}}
            <com:SearchPassenger Key="P_{{@index}}" Code="{{ageCategory}}" {{#if child}}Age="9"{{else if Age}}Age="{{Age}}"{{/if}} xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
            {{/passengers}}
            <air:AirPricingCommand>
                {{#segments}}
                <air:AirSegmentPricingModifiers AirSegmentRef="{{@index}}"{{#if fareBasisCode}} FareBasisCode="{{fareBasisCode}}"{{/if}}>
                {{#if bookingClass}}
                    <air:PermittedBookingCodes>
                            <air:BookingCode Code="{{bookingClass}}" />
                    </air:PermittedBookingCodes>
                {{/if}}
                </air:AirSegmentPricingModifiers>
                {{/segments}}
            </air:AirPricingCommand>
            {{#if emulatePcc}}
            <air:PCC>
                <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
            </air:PCC>
            {{/if}}
        </air:AirPriceReq>
    </soap:Body>
</soap:Envelope>
`;
