module.exports = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <air:AvailabilitySearchReq
            AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
            xmlns:air="http://www.travelport.com/schema/air_v52_0"
            xmlns:com="http://www.travelport.com/schema/common_v52_0"
            >
            <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
            {{#if emulatePcc}}
                <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
            {{/if}}
            {{#nextResultReference}}
                <com:NextResultReference ProviderCode="{{../provider}}">{{{.}}}</com:NextResultReference>
            {{/nextResultReference}}
            {{#legs}}
            <air:SearchAirLeg>
                <air:SearchOrigin>
                    <com:CityOrAirport Code="{{from}}" PreferCity="true"/>
                </air:SearchOrigin>
                <air:SearchDestination>
                    <com:CityOrAirport Code="{{to}}" PreferCity="true"/>
                </air:SearchDestination>
                <air:SearchDepTime PreferredTime="{{departureDate}}"/>
                <air:AirLegModifiers
                    {{#if ../allowDirectAccess}}AllowDirectAccess="true"{{/if}}
                    {{#if ../returnFirstAvailableOnly}}ReturnFirstAvailableOnly="true"{{/if}}
                >
                    {{#*inline "connectionPoint"}}
                      <com:ConnectionPoint>
                        <com:CityOrAirport Code="{{connection}}" />
                      </com:ConnectionPoint>
                    {{/inline}}

                    {{#if ../permittedCarriers}}
                    <air:PermittedCarriers>
                    {{#each ../permittedCarriers as |carrier|}}
                        <com:Carrier Code="{{carrier}}" />
                    {{/each}}
                    </air:PermittedCarriers>
                    {{/if}}

                    {{#if ../permittedConnectionPoints}}
                    <air:PermittedConnectionPoints>
                    {{#each ../permittedConnectionPoints as |connection|}}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:PermittedConnectionPoints>
                    {{/if}}

                    {{#if ../prohibitedConnectionPoints}}
                    <air:ProhibitedConnectionPoints>
                    {{#each ../prohibitedConnectionPoints as |connection| }}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:ProhibitedConnectionPoints>
                    {{/if}}

                    {{#if ../preferredConnectionPoints}}
                    <air:PreferredConnectionPoints>
                    {{#each ../preferredConnectionPoints as |connection|}}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:PreferredConnectionPoints>
                    {{/if}}

                    {{#if ../cabins}}
                    <air:PreferredCabins>
                        {{#each ../cabins}}
                        <com:CabinClass Type="{{this}}"/>
                        {{/each}}
                    </air:PreferredCabins>
                    {{/if}}
                    {{#if ../bookingCodes}}
                    <air:PermittedBookingCodes>
                            {{#each ../bookingCodes}}
                            <air:BookingCode Code="{{this}}"/>
                            {{/each}}
                    </air:PermittedBookingCodes>
                    {{/if}}
                </air:AirLegModifiers>
            </air:SearchAirLeg>
            {{/legs}}
            <air:AirSearchModifiers
                {{#if maxJourneyTime}}
                    MaxJourneyTime="{{maxJourneyTime}}"
                {{/if}}
                IncludeFlightDetails="true"
            >
                <air:PreferredProviders>
                    <com:Provider Code="{{provider}}" xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
                </air:PreferredProviders>

                {{#if permittedCarriers}}
                <air:PermittedCarriers>
                    {{#each permittedCarriers as |carrier|}}
                    <com:Carrier Code="{{carrier}}" xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
                    {{/each}}
                </air:PermittedCarriers>
                {{/if}}

                {{#if preferredCarriers}}
                <air:PreferredCarriers>
                    {{#each preferredCarriers as |carrier|}}
                    <com:Carrier Code="{{carrier}}" xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
                    {{/each}}
                </air:PreferredCarriers>
                {{/if}}

            </air:AirSearchModifiers>
            {{#if priсing}}
            <air:AirPricingModifiers
                {{#if pricing.currency}}
                CurrencyType="{{pricing.currency}}"
                {{/if}}

                {{#if pricing.eTicketability}}
                ETicketability="{{pricing.eTicketability}}"
                {{/if}}
            />
            {{/if}}
            {{#passengers}}
                <com:SearchPassenger Code="{{ageCategory}}"{{#if child}} Age="9"{{/if}} xmlns:com="http://www.travelport.com/schema/common_v52_0"/>
            {{/passengers}}
        </air:AvailabilitySearchReq>
    </soap:Body>
</soap:Envelope>
`;
