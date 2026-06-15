/* worm transform — must match <g id="worm"> above (getPointAtLength returns local coords) */
const WT={tx:330,ty:205,s:1.2};
const wx=x=>WT.tx+x*WT.s, wy=y=>WT.ty+y*WT.s;

/* metro target order aligned to the 6 worm sources below */
const TARGETS=['N','J','L','M','K','T'];
const META={ L:{name:'Taraval',color:'#86308B'}, N:{name:'Judah',color:'#215196'},
  M:{name:'Ocean View',color:'#3A8557'}, K:{name:'Ingleside',color:'#669AAB'},
  J:{name:'Church',color:'#EEAA4E'}, T:{name:'Third',color:'#C22E48'} };

/* REAL Muni Metro geometry (DataSF "Muni Simple Routes", outbound), projected to this 1200x700 canvas */
const MAP={
  "L":[[919.6,83.6],[915.4,80.2],[911.2,76.8],[906.7,74.0],[901.6,74.5],[897.6,78.0],[893.8,81.7],[889.9,85.6],[886.1,89.4],[882.3,93.1],[878.5,97.0],[874.7,100.8],[870.8,104.5],[867.0,108.4],[863.2,112.2],[859.3,116.0],[855.5,119.8],[851.7,123.7],[847.9,127.5],[844.0,131.3],[840.2,135.1],[836.4,138.9],[832.6,142.7],[828.8,146.5],[824.9,150.3],[821.1,154.1],[817.3,157.9],[813.5,161.7],[809.6,165.5],[805.8,169.3],[802.0,173.2],[798.2,177.0],[794.4,180.9],[790.6,184.7],[786.7,188.4],[782.9,192.2],[779.1,196.1],[775.3,199.9],[771.4,203.7],[767.7,207.6],[763.9,211.4],[760.0,215.2],[756.2,219.0],[752.3,222.8],[748.6,226.6],[744.7,230.4],[740.9,234.2],[737.1,238.0],[733.2,241.8],[729.4,245.6],[725.6,249.4],[721.8,253.2],[717.9,257.0],[714.1,260.8],[710.3,264.7],[706.5,268.6],[702.7,272.4],[698.9,276.2],[695.0,280.0],[691.3,283.9],[687.5,287.7],[683.8,291.6],[679.7,295.2],[675.7,298.8],[671.8,302.5],[667.3,305.5],[662.3,307.5],[657.0,308.7],[651.8,309.8],[646.7,311.7],[642.3,314.7],[638.3,318.2],[634.2,321.8],[630.2,325.4],[626.1,328.9],[622.0,332.4],[617.9,336.0],[613.9,339.5],[609.8,343.0],[605.7,346.6],[601.6,350.1],[597.6,353.7],[593.5,357.2],[589.4,360.8],[585.4,364.3],[581.3,367.9],[577.2,371.4],[573.1,374.9],[569.0,378.5],[565.0,382.0],[560.9,385.6],[556.8,389.1],[552.8,392.6],[548.7,396.2],[544.6,399.7],[540.5,403.3],[536.6,407.0],[532.7,410.7],[528.9,414.5],[525.3,418.5],[521.9,422.7],[518.7,427.0],[515.7,431.5],[512.7,436.0],[509.8,440.6],[506.8,445.1],[503.9,449.6],[501.0,454.2],[498.0,458.6],[493.6,456.8],[488.6,455.0],[483.2,454.9],[477.8,455.2],[472.4,455.4],[467.0,455.7],[466.4,450.6],[466.2,445.3],[463.6,442.5],[458.2,442.8],[452.8,443.0],[447.4,443.4],[442.0,443.7],[436.6,444.0],[431.2,444.3],[425.8,444.6],[420.4,444.9],[415.1,445.2],[409.7,445.5],[404.3,445.8],[398.9,446.1],[393.5,446.4],[388.1,446.7],[382.7,447.0],[377.3,447.3],[371.9,447.6],[366.5,447.9],[361.2,448.2],[355.8,448.5],[350.4,448.8],[345.0,449.1],[339.6,449.4],[334.2,449.7],[328.8,450.0],[323.4,450.3],[318.0,450.6],[312.7,450.9],[307.3,451.2],[301.9,451.5],[296.5,451.8],[291.1,452.1],[285.7,452.5],[280.3,452.8],[276.7,454.7],[277.0,460.1],[277.3,465.4],[277.5,470.8],[277.8,476.2],[276.1,479.8],[272.1,481.4],[272.3,486.8]],
  "N":[[885.1,226.7],[888.4,221.8],[892.5,217.7],[896.7,213.5],[900.9,209.4],[905.1,205.2],[909.2,201.0],[913.3,196.8],[917.4,192.5],[921.6,188.4],[925.8,184.3],[930.0,180.1],[934.3,176.1],[937.8,171.4],[938.9,165.7],[939.3,159.8],[939.8,154.0],[940.2,148.1],[940.6,142.2],[941.0,136.3],[941.5,130.4],[941.8,124.6],[941.4,118.7],[940.1,113.0],[937.2,107.9],[933.1,103.7],[929.0,99.4],[926.1,94.4],[924.2,88.9],[920.4,84.4],[916.1,80.4],[911.4,76.9],[906.4,73.9],[901.0,74.9],[896.7,78.9],[892.5,83.0],[888.3,87.2],[884.1,91.3],[880.0,95.5],[875.8,99.7],[871.6,103.8],[867.4,107.9],[863.3,112.1],[859.0,116.2],[854.9,120.4],[850.8,124.6],[846.6,128.8],[842.4,132.9],[838.2,137.1],[834.1,141.2],[829.9,145.4],[825.7,149.6],[821.5,153.7],[817.3,157.9],[813.2,162.0],[809.0,166.2],[804.8,170.3],[800.7,174.6],[796.5,178.7],[792.4,182.9],[788.2,187.0],[784.0,191.2],[779.8,195.4],[775.6,199.5],[771.5,203.7],[767.4,207.9],[763.2,212.0],[759.0,216.2],[754.8,220.4],[750.6,224.5],[746.5,228.7],[742.3,232.8],[738.1,237.0],[733.9,241.1],[729.7,245.3],[725.6,249.4],[721.0,252.9],[715.1,253.4],[709.3,253.8],[703.5,253.8],[697.6,254.2],[691.8,254.7],[685.9,255.2],[680.2,254.6],[674.3,255.2],[668.6,256.6],[662.9,258.1],[657.2,259.5],[651.5,261.0],[645.8,262.4],[640.0,263.9],[634.3,265.3],[628.6,266.8],[622.9,268.2],[617.2,269.7],[611.5,271.2],[605.8,272.6],[600.1,274.1],[594.4,275.5],[590.0,279.4],[584.2,280.5],[578.4,281.4],[572.6,282.3],[566.8,283.3],[561.0,284.2],[555.2,285.2],[549.3,286.1],[543.6,287.1],[540.2,290.1],[534.3,290.4],[528.4,290.7],[522.5,291.0],[516.7,291.4],[510.8,291.7],[504.9,292.0],[499.0,292.3],[494.8,294.2],[495.1,300.1],[495.5,305.9],[489.7,306.3],[483.8,306.7],[477.9,307.0],[472.0,307.3],[466.1,307.6],[460.3,307.9],[454.4,308.3],[448.5,308.6],[442.6,308.9],[436.7,309.3],[430.8,309.5],[425.0,309.9],[419.1,310.2],[413.2,310.6],[407.3,310.9],[401.4,311.2],[395.5,311.5],[389.7,311.9],[383.8,312.2],[377.9,312.6],[372.0,312.8],[366.1,313.1],[360.2,313.5],[354.4,313.8],[348.5,314.2],[342.6,314.5],[336.7,314.8],[330.8,315.2],[324.9,315.4],[319.1,315.8],[313.2,316.1],[307.3,316.4],[301.4,316.8],[295.5,317.1],[289.6,317.5],[283.8,317.8],[277.9,318.1],[272.0,318.4],[266.1,318.7],[260.2,319.1],[254.4,319.2]],
  "M":[[919.6,83.6],[914.9,79.8],[910.2,76.0],[904.9,73.7],[899.7,76.0],[895.3,80.2],[891.0,84.5],[886.8,88.7],[882.5,92.9],[878.2,97.3],[873.9,101.5],[869.6,105.7],[865.4,110.0],[861.1,114.3],[856.7,118.5],[852.6,122.8],[848.3,127.1],[844.0,131.3],[839.7,135.6],[835.4,139.9],[831.2,144.1],[826.9,148.4],[822.6,152.6],[818.3,156.9],[814.0,161.2],[809.7,165.4],[805.5,169.7],[801.3,174.0],[797.0,178.3],[792.7,182.5],[788.4,186.8],[784.1,191.0],[779.9,195.3],[775.6,199.6],[771.3,203.8],[767.1,208.2],[762.8,212.4],[758.5,216.7],[754.3,220.9],[750.0,225.2],[745.7,229.4],[741.4,233.7],[737.1,237.9],[732.8,242.2],[728.5,246.5],[724.3,250.7],[720.0,255.0],[715.7,259.2],[711.5,263.5],[707.3,267.8],[703.0,272.1],[698.7,276.4],[694.4,280.6],[690.2,285.0],[686.0,289.3],[681.6,293.4],[677.1,297.5],[672.7,301.6],[667.9,305.2],[662.3,307.5],[656.4,308.8],[650.5,310.2],[645.1,312.6],[640.4,316.3],[635.9,320.4],[631.4,324.3],[626.8,328.3],[622.2,332.2],[617.7,336.2],[613.1,340.2],[608.5,344.1],[604.0,348.1],[599.4,352.1],[594.9,356.0],[590.3,360.0],[585.8,363.9],[581.2,367.9],[576.7,371.9],[572.1,375.8],[567.5,379.8],[563.0,383.7],[558.4,387.7],[553.9,391.7],[549.3,395.6],[544.8,399.6],[540.2,403.6],[535.8,407.7],[531.5,411.9],[527.3,416.2],[523.4,420.8],[519.6,425.6],[516.3,430.6],[512.9,435.6],[509.7,440.7],[506.4,445.8],[503.1,450.9],[499.8,455.9],[496.2,460.8],[492.5,465.5],[488.6,470.1],[484.5,474.5],[480.4,478.9],[476.3,483.4],[472.3,487.9],[469.3,493.1],[467.0,498.7],[464.5,504.2],[461.3,509.2],[458.1,514.4],[455.0,519.6],[451.8,524.7],[448.9,529.9],[446.3,535.3],[446.5,541.3],[446.2,547.4],[446.0,553.4],[445.8,559.4],[445.5,565.5],[445.3,571.5],[445.1,577.5],[444.8,583.6],[444.6,589.6],[444.3,595.6],[444.0,601.7],[444.3,607.6],[446.7,613.2],[450.3,618.0],[453.9,622.9],[457.4,627.8],[461.0,632.6],[464.6,637.5],[468.3,642.3],[471.9,647.1],[476.1,651.1],[482.1,651.1],[488.1,651.0],[494.2,650.9],[500.2,650.9],[506.2,650.8],[512.3,650.8],[516.0,653.2],[516.1,659.1],[522.2,659.0],[528.2,659.0],[534.2,658.9],[540.3,658.9],[546.3,658.8],[552.4,658.7],[558.4,658.7],[564.4,658.6],[570.1,657.2],[574.5,653.2],[578.0,648.3],[581.4,643.3],[584.7,638.3],[588.1,633.3],[591.4,628.2],[594.0,622.8],[598.3,618.6],[601.5,613.5]],
  "K":[[919.6,83.6],[915.5,80.3],[911.4,77.0],[907.2,74.2],[902.2,74.2],[898.2,77.4],[894.5,81.1],[890.7,84.8],[887.0,88.5],[883.3,92.1],[879.6,95.8],[875.9,99.6],[872.1,103.2],[868.5,106.9],[864.8,110.6],[861.0,114.3],[857.3,117.9],[853.6,121.7],[849.9,125.4],[846.2,129.1],[842.5,132.8],[838.8,136.5],[835.1,140.2],[831.4,143.9],[827.7,147.6],[824.0,151.3],[820.2,155.0],[816.5,158.7],[812.8,162.4],[809.1,166.0],[805.4,169.7],[801.8,173.5],[798.1,177.2],[794.4,180.9],[790.6,184.6],[786.9,188.3],[783.2,191.9],[779.5,195.7],[775.8,199.4],[772.1,203.0],[768.4,206.8],[764.7,210.5],[761.0,214.2],[757.3,217.9],[753.6,221.6],[749.9,225.3],[746.2,229.0],[742.4,232.7],[738.7,236.4],[735.0,240.0],[731.3,243.7],[727.6,247.4],[723.9,251.1],[720.2,254.8],[716.4,258.5],[712.8,262.2],[709.1,265.9],[705.4,269.7],[701.7,273.4],[698.0,277.1],[694.3,280.8],[690.7,284.5],[687.0,288.3],[683.3,292.0],[679.4,295.4],[675.5,299.0],[671.7,302.6],[667.3,305.4],[662.5,307.4],[657.4,308.6],[652.3,309.7],[647.4,311.4],[643.0,314.1],[639.0,317.6],[635.1,321.0],[631.2,324.5],[627.2,327.9],[623.3,331.4],[619.3,334.8],[615.4,338.2],[611.4,341.6],[607.4,345.1],[603.5,348.5],[599.6,352.0],[595.6,355.4],[591.7,358.8],[587.7,362.3],[583.8,365.7],[579.8,369.1],[575.8,372.6],[571.9,376.0],[567.9,379.4],[564.0,382.9],[560.0,386.3],[556.1,389.7],[552.1,393.2],[548.2,396.6],[544.2,400.1],[540.3,403.5],[536.5,407.1],[532.7,410.7],[529.0,414.4],[525.5,418.3],[522.1,422.3],[519.0,426.5],[516.1,430.9],[513.2,435.2],[510.4,439.6],[507.5,444.0],[504.7,448.4],[501.8,452.8],[499.0,457.2],[495.8,461.4],[492.6,465.5],[489.2,469.5],[485.6,473.3],[482.0,477.1],[478.5,481.0],[475.0,484.9],[471.6,488.8],[469.1,493.4],[467.2,498.3],[465.1,503.1],[464.6,508.2],[464.3,513.5],[464.1,518.7],[463.8,523.9],[463.6,529.2],[467.1,532.2],[471.7,534.7],[476.3,537.2],[480.8,539.8],[484.1,543.8],[486.1,548.6],[488.6,553.2],[492.1,557.1],[495.9,560.7],[500.3,563.6],[505.0,565.8],[509.8,568.0],[514.6,570.2],[519.3,572.3],[524.2,574.2],[529.3,575.5],[534.3,576.9],[539.4,578.2],[544.5,579.5],[549.5,580.9],[554.6,582.3],[559.6,583.6],[564.7,584.9],[569.7,586.4],[574.8,587.7],[580.0,588.2],[585.2,588.3],[590.4,588.4],[595.7,588.4],[600.9,588.4],[602.7,591.4],[601.9,596.6]],
  "J":[[919.6,83.6],[916.0,80.7],[912.5,77.9],[908.9,75.1],[904.7,73.7],[900.6,75.1],[897.3,78.3],[894.1,81.5],[890.8,84.7],[887.6,87.9],[884.3,91.1],[881.1,94.3],[877.9,97.6],[874.7,100.8],[871.3,104.0],[868.1,107.2],[864.9,110.5],[861.7,113.7],[858.4,116.9],[855.2,120.1],[852.0,123.4],[848.7,126.6],[845.5,129.8],[842.3,133.0],[839.0,136.3],[835.8,139.5],[832.6,142.7],[829.3,146.0],[826.1,149.2],[822.9,152.4],[819.6,155.6],[816.4,158.8],[813.1,162.0],[809.9,165.3],[806.6,168.5],[803.5,171.8],[800.3,175.0],[797.0,178.2],[793.8,181.5],[790.5,184.7],[787.3,187.9],[784.0,191.1],[780.8,194.3],[777.6,197.6],[774.3,200.8],[771.1,204.0],[767.9,207.3],[764.7,210.5],[761.5,213.7],[758.2,217.0],[755.0,220.2],[751.7,223.4],[748.5,226.6],[745.3,229.8],[742.0,233.1],[738.8,236.3],[735.5,239.5],[732.3,242.7],[729.1,245.9],[725.8,249.2],[722.6,252.4],[718.1,253.2],[713.6,253.5],[709.0,253.9],[706.6,255.3],[706.9,259.8],[707.3,264.4],[707.6,268.9],[707.9,273.5],[708.2,278.1],[708.6,282.6],[708.9,287.2],[709.3,291.7],[709.6,296.3],[710.0,300.8],[710.3,305.4],[710.6,309.9],[711.8,314.2],[712.6,318.7],[713.0,323.2],[713.4,327.8],[713.6,332.4],[713.9,336.9],[717.8,338.6],[719.0,342.7],[719.1,347.3],[716.8,351.1],[716.6,355.6],[714.5,359.4],[714.8,363.9],[715.1,368.5],[715.5,373.0],[715.8,377.6],[716.2,382.1],[716.5,386.7],[716.8,391.3],[717.2,395.8],[717.5,400.4],[717.9,404.9],[718.2,409.5],[718.6,414.0],[719.0,418.6],[719.3,423.1],[719.6,427.7],[719.9,432.3],[720.2,436.8],[720.6,441.4],[721.0,445.9],[721.3,450.5],[725.7,450.3],[730.3,449.9],[734.8,449.6],[739.4,449.2],[738.5,453.3],[737.3,457.7],[736.1,462.1],[734.8,466.5],[733.9,471.0],[732.7,475.4],[730.9,479.5],[728.4,483.4],[725.5,486.9],[722.4,490.3],[719.2,493.4],[715.7,496.5],[712.3,499.5],[708.8,502.4],[705.0,504.9],[701.2,507.4],[697.3,509.8],[693.4,512.2],[689.5,514.6],[685.6,517.0],[681.7,519.4],[677.8,521.7],[674.1,524.5],[671.4,528.1],[669.3,532.0],[665.3,534.1],[660.9,535.4],[656.4,536.2],[652.7,538.8],[649.2,541.6],[645.6,544.4],[642.6,547.8],[640.5,551.8],[638.3,555.8],[636.2,559.9],[633.7,563.7],[631.2,567.5],[628.7,571.3],[626.2,575.2],[623.7,579.0],[621.2,582.8],[618.7,586.6],[615.1,588.4],[610.5,588.4],[605.9,588.4],[602.8,590.6],[602.6,595.2]],
  "T":[[843.2,690.0],[845.1,686.1],[847.1,682.2],[849.0,678.3],[850.9,674.4],[853.1,670.6],[855.8,667.2],[859.7,665.4],[863.8,664.0],[867.3,661.4],[870.0,658.0],[872.7,654.6],[875.4,651.1],[877.0,647.1],[878.4,643.0],[880.6,639.3],[882.2,635.3],[882.4,630.9],[882.6,626.6],[884.0,622.5],[886.6,618.9],[888.6,615.2],[890.5,611.3],[891.9,607.2],[893.4,603.0],[894.8,598.9],[896.3,594.8],[897.7,590.7],[899.3,586.6],[900.7,582.5],[902.2,578.4],[903.7,574.3],[905.1,570.2],[906.6,566.1],[908.0,562.0],[909.5,557.9],[910.9,553.7],[912.3,549.6],[913.6,545.4],[914.8,541.2],[915.9,537.0],[917.1,532.8],[918.3,528.6],[919.4,524.4],[920.6,520.2],[921.8,516.0],[922.9,511.8],[924.0,507.6],[925.2,503.4],[926.4,499.2],[927.5,495.0],[928.7,490.8],[929.9,486.6],[931.0,482.4],[932.2,478.2],[933.4,474.0],[934.6,469.8],[935.7,465.6],[936.9,461.4],[938.0,457.2],[939.2,453.0],[940.4,448.8],[941.6,444.6],[942.8,440.4],[943.7,436.2],[944.9,432.0],[945.5,427.7],[945.4,423.4],[945.1,419.0],[944.8,414.7],[944.4,410.3],[944.1,406.0],[943.8,401.6],[943.4,397.3],[943.1,392.9],[942.9,388.6],[942.8,384.2],[942.5,379.9],[942.2,375.5],[941.8,371.2],[941.5,366.8],[941.2,362.5],[940.9,358.1],[940.5,353.8],[940.1,349.4],[939.6,345.1],[939.2,340.8],[938.8,336.4],[938.5,332.1],[938.2,327.7],[937.9,323.4],[937.6,319.0],[937.2,314.7],[936.8,310.3],[936.6,306.0],[936.5,301.6],[936.2,297.3],[936.0,292.9],[935.7,288.6],[935.3,284.2],[935.0,279.9],[934.7,275.5],[934.3,271.2],[934.0,266.8],[933.6,262.5],[933.2,258.1],[932.9,253.8],[932.6,249.4],[932.3,245.1],[932.0,240.7],[931.7,236.4],[931.3,232.0],[930.9,227.7],[930.6,223.4],[930.3,219.0],[928.2,216.6],[923.8,217.0],[919.6,216.7],[916.3,213.8],[913.2,210.8],[910.0,207.8],[907.0,204.7],[903.9,201.6],[900.8,198.5],[897.7,195.4],[894.7,192.3],[891.6,189.2],[888.6,186.1],[885.5,183.0],[882.5,179.8],[879.4,176.8],[876.3,173.7],[873.3,170.6],[870.2,167.5],[867.1,164.4],[864.0,161.3],[861.0,158.2],[857.9,155.1],[854.8,152.1],[851.7,149.0],[848.6,145.9],[845.5,142.8],[842.5,139.7],[839.5,136.6],[836.6,134.6],[835.9,130.3],[835.3,126.0],[834.6,121.7],[833.9,117.4],[833.2,113.1],[832.5,108.7],[831.8,104.4],[831.1,100.1],[830.4,95.8],[829.7,91.5],[829.0,87.2],[828.3,82.9],[827.7,78.6],[827.0,74.3],[826.3,70.0]],
};

/* ---------- helpers ---------- */
function resample(pts,n){
  const d=[0];
  for(let i=1;i<pts.length;i++) d.push(d[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  const tot=d[d.length-1]||1; const out=[]; let s=0;
  for(let i=0;i<n;i++){ const t=(i/(n-1))*tot;
    while(s<pts.length-2 && d[s+1]<t) s++;
    const sl=(d[s+1]-d[s])||1, f=(t-d[s])/sl;
    out.push([pts[s][0]+(pts[s+1][0]-pts[s][0])*f, pts[s][1]+(pts[s+1][1]-pts[s][1])*f]); }
  return out;
}
/* closed ribbon outline around a polyline (so a transit line is a fillable shape, like the worm strokes) */
function ribbon(poly,w){
  const n=poly.length, Ls=[], Rs=[], h=w/2;
  for(let i=0;i<n;i++){
    const a=poly[Math.max(0,i-1)], b=poly[Math.min(n-1,i+1)];
    let dx=b[0]-a[0], dy=b[1]-a[1]; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    const nx=-dy*h, ny=dx*h;
    Ls.push([poly[i][0]+nx, poly[i][1]+ny]); Rs.push([poly[i][0]-nx, poly[i][1]-ny]);
  }
  return Ls.concat(Rs.reverse());
}
/* sample an SVG path outline into a ring of viewBox-space points */
function samplePath(el){
  const len=el.getTotalLength();
  const n=Math.max(300,Math.min(1300,Math.round(len/1.4)));
  const r=[];
  for(let i=0;i<n;i++){ const p=el.getPointAtLength(len*i/n); r.push([wx(p.x),wy(p.y)]); }
  return r;
}
/* cut a ring with the vertical line x=xc, splitting at the two bottom-most crossings
   (a short chord across the tube floor) -> returns [leftHalf, rightHalf], which still tile the original */
function splitRingAtX(ring,xc){
  const cr=[];
  for(let i=0;i<ring.length;i++){ const a=ring[i], b=ring[(i+1)%ring.length];
    if((a[0]-xc)*(b[0]-xc)<0){ const t=(xc-a[0])/(b[0]-a[0]); cr.push({i,y:a[1]+(b[1]-a[1])*t,pt:[xc,a[1]+(b[1]-a[1])*t]}); } }
  cr.sort((p,q)=>q.y-p.y);                 // bottom-most first = the U floor
  let A=cr[0], B=cr[1]; if(A.i>B.i){const t=A;A=B;B=t;}
  const a1=[A.pt]; for(let i=A.i+1;i<=B.i;i++) a1.push(ring[i]); a1.push(B.pt);
  const a2=[B.pt]; for(let i=B.i+1;i<ring.length;i++) a2.push(ring[i]); for(let i=0;i<=A.i;i++) a2.push(ring[i]); a2.push(A.pt);
  const cx=a=>a.reduce((s,p)=>s+p[0],0)/a.length;
  return cx(a1)<cx(a2)?[a1,a2]:[a2,a1];
}
function hx(c){c=c.replace('#','');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)];}
function mix(a,b,t){return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;}
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const smooth=(e0,e1,x)=>{const t=Math.min(1,Math.max(0,(x-e0)/(e1-e0)));return t*t*(3-2*t);};
function toPath(p){let s='M'+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);for(let i=1;i<p.length;i++)s+='L'+p[i][0].toFixed(1)+' '+p[i][1].toFixed(1);return s+'Z';}
/* resample a CLOSED ring to n evenly-spaced points; optionally carry a parallel scalar array */
function resampleClosedV(pts,vals,n){
  const r=pts.concat([pts[0]]), v=vals?vals.concat([vals[0]]):null, d=[0];
  for(let i=1;i<r.length;i++) d.push(d[i-1]+Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]));
  const tot=d[d.length-1]||1, op=[], ov=v?[]:null; let s=0;
  for(let i=0;i<n;i++){ const t=(i/n)*tot; while(s<r.length-2&&d[s+1]<t)s++;
    const sl=(d[s+1]-d[s])||1, f=(t-d[s])/sl;
    op.push([r[s][0]+(r[s+1][0]-r[s][0])*f, r[s][1]+(r[s+1][1]-r[s][1])*f]);
    if(v) ov.push(v[s]+(v[s+1]-v[s])*f); }
  return {pts:op, vals:ov};
}
/* closed ribbon outline + per-vertex arc position along the line (0 = head, 1 = tail) */
function ribbonLP(poly,w){
  const m=poly.length, Ls=[], Rs=[], lpL=[], lpR=[], h=w/2;
  for(let i=0;i<m;i++){ const a=poly[Math.max(0,i-1)], b=poly[Math.min(m-1,i+1)];
    let dx=b[0]-a[0],dy=b[1]-a[1]; const mm=Math.hypot(dx,dy)||1; dx/=mm; dy/=mm;
    const lp=i/(m-1); Ls.push([poly[i][0]-dy*h,poly[i][1]+dx*h]); lpL.push(lp);
    Rs.push([poly[i][0]+dy*h,poly[i][1]-dx*h]); lpR.push(lp); }
  return {pts:Ls.concat(Rs.reverse()), lp:lpL.concat(lpR.reverse())};
}
/* resample src ring & dst ribbon to NP pts and rotate/flip src to best correspond to dst */
const NP=520;
function prep(srcRing,dstObj){
  const S=resampleClosedV(srcRing,null,NP).pts, D=resampleClosedV(dstObj.pts,dstObj.lp,NP);
  let best={c:Infinity,off:0,rev:false};
  for(const rev of [false,true]){ const SS=rev?S.slice().reverse():S;
    for(let off=0;off<NP;off+=4){ let c=0;
      for(let i=0;i<NP;i+=8){const a=SS[(i+off)%NP],b=D.pts[i],dx=a[0]-b[0],dy=a[1]-b[1];c+=dx*dx+dy*dy;}
      if(c<best.c) best={c,off,rev}; } }
  const SS=best.rev?S.slice().reverse():S, Sa=new Array(NP);
  for(let i=0;i<NP;i++) Sa[i]=SS[(i+best.off)%NP];
  return {S:Sa, D:D.pts, lp:D.vals};
}

/* ---------- build morph from the worm's OWN 5 segments (long m-u-n segment used twice -> 6) ---------- */
const wormG=document.getElementById('worm');
const wp=[...wormG.querySelectorAll('path')];   // [0]=long m-u-n serpentine  [1]=i bar  [2]=left fill  [3]=centre post  [4]=right fill
// worm chunk base colour: the original Landor logo reds — must match the #worm fills in styles.css
// (--worm #cc3847 for every segment; --worm-i #cf2645 for the "i" bar, which is srcRings[5] -> the T line)
const BASE=['#cc3847','#cc3847','#cc3847','#cc3847','#cc3847','#cf2645'].map(hx);
const DST =TARGETS.map(k=>hx(META[k].color));

// split the long serpentine in half at the bottom of the U (x=603); N gets the left half, J the right half
const [halfL,halfR]=splitRingAtX(samplePath(wp[0]), 603);
const srcRings=[ halfL, halfR, samplePath(wp[2]), samplePath(wp[3]), samplePath(wp[4]), samplePath(wp[1]) ];

/* ---- offset the lines that share the Market St subway into parallel bands ----
   Only J/K/L/M/N share Market (T uses the separate Central Subway, so it's left alone).
   Each shared line is pushed perpendicular to the trunk's local direction, fading to 0
   once it diverges, so branches keep their true geometry. Order across the band: edit TRUNK_ORDER. */
const TRUNK = resample(MAP['L'].slice(0,108), 110);      // Embarcadero -> Market -> Twin Peaks tunnel -> West Portal
const TRUNK_ORDER=['K','M','L','J','N'];                 // NE edge -> SW edge of the trunk (band reads: dark blue, yellow, purple, green, blue)
const OFF_SP=10;
function nearestTrunk(p){ let bd=1e9,bi=0;
  for(let i=0;i<TRUNK.length;i++){const dx=TRUNK[i][0]-p[0],dy=TRUNK[i][1]-p[1],d=dx*dx+dy*dy; if(d<bd){bd=d;bi=i;}}
  return {d:Math.sqrt(bd),i:bi}; }
function offsetLine(key){
  const poly=resample(MAP[key],120);
  const idx=TRUNK_ORDER.indexOf(key);
  if(idx<0) return poly;                                  // T: untouched
  const off=(idx-(TRUNK_ORDER.length-1)/2)*OFF_SP;
  return poly.map(p=>{
    const nt=nearestTrunk(p), w=1-smooth(6,40,nt.d);       // 1 on the trunk, 0 once diverged
    if(w<0.002) return p;
    const a=TRUNK[Math.max(0,nt.i-1)], b=TRUNK[Math.min(TRUNK.length-1,nt.i+1)];
    let dx=b[0]-a[0],dy=b[1]-a[1]; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    return [p[0]-dy*off*w, p[1]+dx*off*w];
  });
}
/* Embarcadero is the real NE terminus of the Market trunk (J/K/L/M); N runs through it to Caltrain.
   Keep the full, geographically-accurate line geometry — no truncation. */
const EMB=[919.6,83.6];
const TDIR=(function(){let dx=TRUNK[0][0]-TRUNK[14][0],dy=TRUNK[0][1]-TRUNK[14][1];const m=Math.hypot(dx,dy)||1;return [dx/m,dy/m];})(); // unit dir along the trunk toward Embarcadero
const CUT=[EMB[0]-TDIR[0]*50, EMB[1]-TDIR[1]*50];        // J/K/L/M terminate here (Embarcadero); N continues through to Caltrain
const CAPN=[Math.SQRT1_2,-Math.SQRT1_2];                 // normal of the 45° cap (points NE) -> cut the lines on the cap line so they align
function truncTrunk(poly){ const sd=p=>(p[0]-CUT[0])*CAPN[0]+(p[1]-CUT[1])*CAPN[1];
  for(let i=0;i<poly.length-1;i++){ const a=poly[i],b=poly[i+1],da=sd(a),db=sd(b);
    if(da>0&&db<=0){ const t=da/(da-db); return [[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]].concat(poly.slice(i+1)); } }
  return poly; }
const TRUNK_END=['J','K','L','M'];                       // these terminate at the Embarcadero cap; N stays full
const offsets={}; TARGETS.forEach(k=>{ let p=offsetLine(k); if(TRUNK_END.includes(k)) p=truncTrunk(p); offsets[k]=p; });
// nudge the finished MAP down a touch (it sat high — cut off at top, empty at bottom). Shift only the line
// DESTINATIONS, so the morph still starts on the centered worm logo and just settles lower; caps read offsets, so they follow.
const MAP_DROP=30;
TARGETS.forEach(k=>offsets[k].forEach(p=>{p[1]+=MAP_DROP;}));
document.getElementById('landPath').setAttribute('transform',`translate(0 ${MAP_DROP})`);  // SF silhouette drops too; clip frame on #land stays put (no edge band)
// each line: exact worm-outline source -> metro ribbon, prepped for a head->tail arc-phase morph
const MORPH=srcRings.map((s,i)=>prep(s, ribbonLP(offsets[TARGETS[i]], 10.5)));

const linesG=document.getElementById('lines');
// paths stay indexed by MORPH/TARGETS order (render() relies on it); DOM append order sets z-order.
const paths=MORPH.map(()=>document.createElementNS('http://www.w3.org/2000/svg','path'));
// stack red (T) at the bottom and yellow (J) on top, others keep their relative order in between
const Z_ORDER=['T','N','L','M','K','J'];                  // bottom -> top
Z_ORDER.forEach(k=>linesG.appendChild(paths[TARGETS.indexOf(k)]));

/* stations */
const NS='http://www.w3.org/2000/svg', stationsG=document.getElementById('stations');
const landG=document.getElementById('land');
function dot(x,y,col,big){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',big?7:5);
  if(big){c.setAttribute('class','hub');c.setAttribute('stroke-width',4);}     // fill/stroke via CSS (theme bg/ink)
  else{c.setAttribute('fill',col);c.setAttribute('stroke',col);c.setAttribute('stroke-width',3);}
  stationsG.appendChild(c);}
/* ---------- end caps: black-outlined white bars at every terminus + one diagonal cap at Embarcadero ---------- */
const capsG=document.getElementById('caps');
function capBar(x,y,deg,len,th){ const r=document.createElementNS(NS,'rect');     // rounded-end (pill) bar
  r.setAttribute('x',(-len/2).toFixed(1)); r.setAttribute('y',(-th/2).toFixed(1)); r.setAttribute('width',len); r.setAttribute('height',th);
  r.setAttribute('rx',(th/2).toFixed(1)); r.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
  r.setAttribute('fill','#f7f5ef'); r.setAttribute('stroke','#1b1b1b'); r.setAttribute('stroke-width','2.4'); capsG.appendChild(r); }
function termCap(key,atEnd){ const p=offsets[key], pt=atEnd?p[p.length-1]:p[0];     // circular terminus cap
  const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',pt[0].toFixed(1)); c.setAttribute('cy',pt[1].toFixed(1)); c.setAttribute('r','7.5');
  c.setAttribute('fill','#f7f5ef'); c.setAttribute('stroke','#1b1b1b'); c.setAttribute('stroke-width','2.4'); capsG.appendChild(c); }
['J','L','M'].forEach(k=>termCap(k,true));             // J & K share Balboa Park -> one circle; plus L, M outer termini
termCap('N',true); termCap('N',false);                 // N: Ocean Beach + Caltrain
termCap('T',true); termCap('T',false);                 // T (Central Subway): Chinatown + Sunnydale
(function(){ const ce=['J','K','L','M'].map(k=>offsets[k][0]);          // the four truncated ends (collinear on the 45° cap line)
  const cx=ce.reduce((s,p)=>s+p[0],0)/4, cy=ce.reduce((s,p)=>s+p[1],0)/4;
  let sp=0; ce.forEach(a=>ce.forEach(b=>sp=Math.max(sp,Math.hypot(a[0]-b[0],a[1]-b[1]))));
  const EXT=9, d=[Math.SQRT1_2,Math.SQRT1_2];          // grow the NW (-x) end only -> reach up over the N (blue) line; SE end stays put
  capBar(cx-d[0]*EXT/2, cy-d[1]*EXT/2, 45, sp+9.5+16+EXT, 11); })();

/* each thread peels off one-by-one, in route order J K L M N T */
const RANK={J:0,K:1,L:2,M:3,N:4,T:5};
const SEQ=TARGETS.map(k=>RANK[k]);   // stagger rank per morph element
const STEP=1/6, SPAN=1/6;            // 6 non-overlapping windows: each line fully separates before the next begins

/* ---------- render ---------- */
const LAG=1.3;          // head->tail spread: each line settles from its head before the tail follows
const COLOR_FRAC=0.34;  // first 34% of each line's window: recolor in place; then it snakes out
function render(T){
  for(let i=0;i<paths.length;i++){
    const start=SEQ[i]*STEP;
    const p=Math.min(1,Math.max(0,(T-start)/SPAN));     // this line's window progress
    const cp=Math.min(1, p/COLOR_FRAC);                 // colour phase (in place)
    const mp=Math.max(0, (p-COLOR_FRAC)/(1-COLOR_FRAC));// movement phase (snake)
    const M=MORPH[i], S=M.S, D=M.D, lp=M.lp, pts=new Array(NP);
    for(let j=0;j<NP;j++){
      const lt=ease(Math.min(1,Math.max(0, mp*(1+LAG) - lp[j]*LAG)));   // arc-phased: head first
      pts[j]=[S[j][0]+(D[j][0]-S[j][0])*lt, S[j][1]+(D[j][1]-S[j][1])*lt];
    }
    paths[i].setAttribute('d', toPath(pts));
    paths[i].setAttribute('fill', mix(BASE[i],DST[i],ease(cp)));
  }
  // hard hand-off: T=0 -> crisp worm only; the instant morph begins -> glowing lines only.
  // (a cross-fade here would dip through the dark bg and read as a "darker flash")
  const lit = T>0.012;
  wormG.style.opacity  = lit?0:1;
  linesG.style.opacity = lit?1:0;
  stationsG.style.opacity = Math.max(0,(T-0.78)/0.22).toFixed(2);

  legendChips.forEach((r)=>r.el.classList.toggle('on', T > (r.rank+0.85)*STEP));
  document.body.classList.toggle('map-ready', T>=1);   // only the finished map is interactive (lines selectable)
  if(T<1) clearSelection();                            // stepping/folding away from the map drops any line selection
}

/* ---------- legend (route order) ---------- */
const legendEl=document.getElementById('legend'), legendChips=[];
['J','K','L','M','N','T'].forEach((k,rank)=>{ const m=META[k]; const el=document.createElement('div');
  el.className='chip'; el.style.setProperty('--c',m.color); el.dataset.line=k;
  el.innerHTML=`<span class="badge">${k}</span><span class="nm">${m.name}</span>`;
  legendEl.appendChild(el); legendChips.push({el,rank,key:k}); });

/* ---------- timeline ----------
   Master position POS spans two phases: 0->1 draws the worm, 1->2 morphs worm -> map (morph T = POS-1).
   Both phases are position-driven, so the whole thing scrubs / winds / unwinds via the arrow-key stops below. */
let POS=0, raf=null, aim=1, wormMode=null;   // aim=in-flight target (for mid-flight stepping); wormMode 'draw'|'full' avoids per-frame restyle
function renderMaster(pos){
  if(pos < 1){                                          // DRAW phase: the worm traces itself; lines + stations hidden
    if(wormMode!=='draw'){ armWorm(); wormMode='draw'; }
    wormG.style.opacity=1; linesG.style.opacity=0; stationsG.style.opacity=0;
    legendChips.forEach(r=>r.el.classList.remove('on'));
    renderDraw(pos);
  } else {                                              // MORPH phase: hand off to the existing T-driven renderer
    if(wormMode!=='full'){ setWormFull(); wormMode='full'; }
    render(pos-1);
  }
}
function animateTo(target,dur,onDone){ cancelAnimationFrame(raf); aim=target;
  const start=POS, t0=performance.now(), d=Math.abs(target-start)*dur+120;
  (function step(now){ const k=Math.min(1,(now-t0)/d); POS=start+(target-start)*k; renderMaster(POS);
    if(k<1) raf=requestAnimationFrame(step); else { POS=target; raf=null; if(onDone) onDone(); } })(t0); }

/* ---------- WebAudio: synthesized transit sounds, no asset files ---------- */
let actx=null;
function audio(){ try{ if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){} return actx; }
function blip(freq,o){ o=o||{}; const c=audio(); if(!c) return; const t=c.currentTime+(o.t||0), dur=o.dur||.15;
  const osc=c.createOscillator(), g=c.createGain(); osc.type=o.type||'sine'; osc.frequency.setValueAtTime(freq,t);
  if(o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide,t+dur);
  const v=o.vol==null?.2:o.vol; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  osc.connect(g); g.connect(c.destination); osc.start(t); osc.stop(t+dur+.03); }
const sndTap  =()=>{ blip(2050,{type:'square',dur:.05,vol:.13}); blip(2700,{t:.085,type:'square',dur:.1,vol:.13}); };   // digital reader beep (bip-boop)
const sndDing =()=>{ blip(760,{type:'sine',dur:.75,vol:.3}); blip(1520,{type:'sine',dur:.5,vol:.08}); };               // stop-request bong
const sndChime=()=>{ [988,1319,1568].forEach((f,i)=>blip(f,{t:i*.15,type:'sine',dur:.5,vol:.16})); };                  // doors / arrival
const sndTick =()=>blip(820+Math.random()*620,{type:'square',dur:.016,vol:.045});                                       // flap clatter

/* ---------- progressive reveal: tap in -> fullscreen morph -> click to tap off ---------- */
const caseEl=document.getElementById('case'), screenEl=document.getElementById('stage');
const hint=document.getElementById('hint');
let caseShown=false;
const exitHint=document.getElementById('exit');
function fillTransform(){                                  // scale the case so its screen fills the viewport (frame slides off-edge)
  const sw=screenEl.offsetWidth||800, sh=screenEl.offsetHeight||400;
  const S=Math.max(innerWidth/sw, innerHeight/sh)*1.0;
  // shift the case so the SCREEN's centre (not the steel case's) lands at viewport centre — accounts for header + padding so no frame shows
  const dx=(screenEl.offsetLeft+sw/2)-caseEl.offsetWidth/2;
  const dy=(screenEl.offsetTop+sh/2)-caseEl.offsetHeight/2;
  return `translate(calc(-50% - ${(dx*S).toFixed(1)}px), calc(-50% - ${(dy*S).toFixed(1)}px)) scale(${S})`;
}
function revealCase(){ if(caseShown) return; caseShown=true;
  document.body.classList.add('playing');                 // dim+blur the platform; fade the intro pieces away
  hint.classList.add('gone'); caseEl.classList.add('shown');
  caseEl.style.transform=fillTransform(); }               // dive through the glass -> fullscreen morph
function exitToIntro(){ if(!caseShown) return; caseShown=false;   // flip immediately so held-left repeats don't keep restarting (and cancelling) this exit's tween
  exitHint.classList.remove('show'); landG.classList.remove('show'); capsG.classList.remove('show'); legendEl.classList.remove('show');
  animateTo(0, 2400, ()=>{ document.body.classList.remove('playing');
    caseEl.classList.remove('shown'); caseEl.style.transform=''; resetCard(); hint.classList.remove('gone'); }); }
addEventListener('resize', ()=>{ if(caseShown) caseEl.style.transform=fillTransform(); });

/* ---------- drag the Clipper card onto the reader (two-finger spin physics) ---------- */
const reader=document.getElementById('reader'), card=document.getElementById('ccard');
const readerC=()=>{ const r=reader.getBoundingClientRect(); return {x:r.left+r.width/2, y:r.top+r.height/2, rad:r.width/2}; };
function tapAccept(){ audio(); reader.classList.add('tap'); sndTap(); setTimeout(()=>reader.classList.remove('tap'), 700); }
/* ---------- "trace the worm": the logo draws itself as one continuous line (a scrubbable timeline stage) ---------- */
/* Drawn strictly left->right as a single unbroken gesture, so the pen sweeps across "muni" once.
   Order is by each stroke's centre-x (measured): left fill -> m-u-n spine -> centre post -> right fill -> "i".
   POSITION-driven via renderDraw(d) (d=0 blank .. 1 full worm), so arrow keys can wind/unwind it. */
const TRACE_ORDER=[2,0,3,4,1];                        // L->R by centre-x: wp[2]=left fill(113) · [0]=spine(194) · [3]=centre(229) · [4]=right fill(333) · [1]="i" bar(410)
const SEAM=0.82;                                      // each stroke begins at 82% of the previous -> flowing, no pen-lift between letters
// per-stroke draw windows in normalized [0,1] draw-space (constant pen speed: window length ∝ stroke length)
const DRAW_WIN=(function(){ const lens=wp.map(p=>p.getTotalLength()), win=new Array(wp.length); let t=0,end=0;
  TRACE_ORDER.forEach(i=>{ const dur=lens[i]; win[i]={start:t,end:t+dur,len:lens[i]}; end=Math.max(end,t+dur); t+=dur*SEAM; });
  win.forEach(w=>{ w.start/=end; w.end/=end; }); return win; })();
function armWorm(){                                    // set the worm up as an undrawn, unfilled outline (rAF-driven, no CSS transition)
  wp.forEach((p,i)=>{ const len=p.getTotalLength();
    p.style.transition='none'; p.style.fillOpacity='0'; p.style.strokeOpacity='1';
    p.style.stroke=i===1?'var(--worm-i)':'var(--worm)';  // [1]=the "i" bar -> its own crimson, matching the fill
    // butt caps (not round): each glyph outline is drawn from a fixed start point, and a round cap there
    // leaves a stray dot at that corner the whole time it draws (e.g. the "i" bar starts at its top-left).
    p.style.strokeWidth='2.5'; p.style.strokeLinecap='butt'; p.style.strokeLinejoin='round';
    p.style.strokeDasharray=len; p.style.strokeDashoffset=len; }); }
function setWormFull(){                                 // drop all inline styling -> plain CSS-filled worm (clean hand-off to the morph)
  wp.forEach(p=>['transition','fillOpacity','stroke','strokeWidth','strokeLinecap','strokeLinejoin','strokeDasharray','strokeDashoffset','strokeOpacity'].forEach(k=>p.style[k]='')); }
function renderDraw(d){                                 // scrub the trace to draw-fraction d (0..1); fully reversible
  wp.forEach((p,i)=>{ const w=DRAW_WIN[i];
    const local=Math.min(1,Math.max(0,(d-w.start)/((w.end-w.start)||1)));
    const ot=Math.min(1, local/0.7);                    // outline draws over the first 70% of this stroke's window
    const ft=Math.min(1,Math.max(0,(local-0.7)/0.3));   // red floods the fill over the last 30%
    p.style.strokeDashoffset=(w.len*(1-ot)).toFixed(1);
    p.style.fillOpacity=ft.toFixed(3);
    p.style.strokeOpacity=(1-0.8*ft).toFixed(3); }); }   // pen line recedes as the fill arrives
const DRAW_MS=2700, MORPH_MS=9000;                      // auto-play pacing: draw ~2.7s, then morph ~9s
function startPlay(){ POS=0; renderMaster(0); revealCase();          // blank screen, zoom in
  setTimeout(()=>animateTo(1, DRAW_MS, ()=>{                          // the worm draws itself...
    setTimeout(()=>animateTo(2, MORPH_MS, ()=>{ sndChime(); landG.classList.add('show'); capsG.classList.add('show'); legendEl.classList.add('show'); }), 650);   // ...beat, then morph into the map
  }), 450); }   // let the zoom settle, then the pen starts
function resetCard(){ card.style.transition=''; card.style.transform='translate(-50%,-50%)'; card.style.transformOrigin=''; }

/* the card pivots around the grab point (held between two fingers): velocity drags the body so it
   trails, swings and — with fast circular motion — spins right around the cursor. */
let drag=null, physReq=null;
const PULL=0.055, DAMP=1.8, REST=2.2;   // PULL=how hard motion rotates it · DAMP=settle · REST=return-upright (loose = flickable)
function phys(){
  if(!drag){ physReq=null; return; }
  const dt=1/60;
  if(drag.held){                                            // following the cursor: motion drags the body around
    const vx=drag.px-drag.lpx, vy=drag.py-drag.lpy; drag.lpx=drag.px; drag.lpy=drag.py;
    const speed=Math.hypot(vx,vy);
    let aa=-DAMP*drag.omega;
    if(speed>0.4){ const target=Math.atan2(-vy,-vx); let diff=target-drag.theta; diff=Math.atan2(Math.sin(diff),Math.cos(diff));
      aa += diff*Math.min(speed,90)*PULL; }
    let dth=drag.theta-drag.restAng; dth=Math.atan2(Math.sin(dth),Math.cos(dth)); aa += -REST*dth;
    drag.omega += aa*dt; drag.theta += drag.omega*dt;
    drag.dx=drag.px-drag.sx; drag.dy=drag.py-drag.sy;
  } else {                                                   // released: momentum carries it (flick), then it settles + drifts home
    let dth=drag.theta-drag.restAng; dth=Math.atan2(Math.sin(dth),Math.cos(dth));
    drag.omega += (-DAMP*drag.omega - REST*dth)*dt; drag.theta += drag.omega*dt;
    drag.dx*=0.86; drag.dy*=0.86;
    if(Math.abs(drag.omega)<0.04 && Math.abs(dth)<0.01 && Math.hypot(drag.dx,drag.dy)<0.6){ resetCard(); drag=null; physReq=null; return; }
  }
  const deg=(drag.theta-drag.restAng)*180/Math.PI;
  card.style.transform=`translate(-50%,-50%) translate(${drag.dx}px,${drag.dy}px) rotate(${deg}deg)`;
  physReq=requestAnimationFrame(phys);
}
card.addEventListener('pointerdown',e=>{ e.preventDefault(); audio();
  const r=card.getBoundingClientRect(), gx=e.clientX-r.left, gy=e.clientY-r.top;
  const restAng=Math.atan2(r.height/2-gy, r.width/2-gx);        // rod from grab point to card centre
  drag={ held:true, sx:e.clientX, sy:e.clientY, px:e.clientX, py:e.clientY, lpx:e.clientX, lpy:e.clientY, dx:0, dy:0, theta:restAng, omega:0, restAng,
         restCx:r.left+r.width/2, restCy:r.top+r.height/2 };   // card's resting centre, for the drop-onto-reader
  card.style.transformOrigin=`${gx}px ${gy}px`; card.style.transition='none'; card.classList.add('dragging');
  card.setPointerCapture(e.pointerId); if(!physReq) physReq=requestAnimationFrame(phys); });
card.addEventListener('pointermove',e=>{ if(!drag||!drag.held) return; drag.px=e.clientX; drag.py=e.clientY;
  const c=readerC(); reader.classList.toggle('armed', Math.hypot(drag.px-c.x,drag.py-c.y) < c.rad*1.15); });
card.addEventListener('pointerup',e=>{ if(!drag) return;
  const c=readerC(), hit=Math.hypot(drag.px-c.x,drag.py-c.y) < c.rad*1.2;
  card.classList.remove('dragging'); reader.classList.remove('armed');
  if(hit){
    // land somewhere ON the reader, not dead-centre — a little human jitter in position + tilt
    const jx=(Math.random()*2-1)*c.rad*0.26, jy=(Math.random()*2-1)*c.rad*0.26, jr=(Math.random()*2-1)*7;
    const tx=c.x+jx-drag.restCx, ty=c.y+jy-drag.restCy; drag=null;   // stop physics
    if(physReq){cancelAnimationFrame(physReq); physReq=null;}
    card.style.transition='transform .24s cubic-bezier(.3,.85,.3,1)';   // "fall" flat onto the reader (glide + settle slightly askew)
    card.style.transform=`translate(-50%,-50%) translate(${tx}px,${ty}px) rotate(${jr.toFixed(2)}deg)`;
    tapAccept();
    setTimeout(startPlay, 1000);                                // hold a beat on the reader, then the worm appears + morph
  }
  else { drag.held=false; }                                    // let the flick carry, then settle home via physics
});
card.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tapAccept(); setTimeout(startPlay,900); } });  // a11y fallback

/* ---------- arrow keys: step lines one at a time (J K L M N T); hold or mash to fly through ---------- */
/* stops in master-POS space: 1 = drawn worm · then one stop per line peeling off · 2 = finished map */
const STOPS=[1].concat([0,1,2,3,4,5].map(r=>1+Math.min(1, r*STEP+SPAN)));
let lastStep=0;
function goTo(target,dur,tick){ aim=target; audio(); if(tick) sndTick();
  if(target>0.02) revealCase(); const done=target>=2;
  landG.classList.toggle('show', done); capsG.classList.toggle('show', done); legendEl.classList.toggle('show', done);
  animateTo(target, dur, done?sndChime:null); }
function stepStage(dir,fast){
  // slideshow chain: intro (caseShown=false) <-> draw the worm (POS 0->1) <-> morph stops <-> finished map (POS 2)
  if(!caseShown){ if(dir>0) goTo(1, 1500, true); return; }    // from the intro: right zooms in AND draws the worm; left does nothing (already home)
  const base = raf!=null ? aim : POS;                         // mid-flight: step off the in-flight target so mashing/holding keeps advancing
  if(dir<0 && base<=1+1e-3){ exitToIntro(); return; }         // at the worm (POS<=1): left un-draws the worm and rewinds to the intro
  let target;
  if(dir>0){ target=STOPS.find(s=>s>base+1e-3); if(target==null) target=2; }
  else { const p=STOPS.filter(s=>s<base-1e-3); target=p.length?p[p.length-1]:1; }
  goTo(target, fast?90:900, true); }               // snappy; near-instant when holding/mashing so stages fly past
/* wind/unwind indicator: clickable buttons mirroring the arrow keys, with a press-flash on key/click */
const windPrev=document.getElementById('windPrev'), windNext=document.getElementById('windNext');
function pressKey(el){ el.classList.remove('press'); void el.offsetWidth; el.classList.add('press'); }  // reflow retriggers the animation
windPrev.addEventListener('animationend',()=>windPrev.classList.remove('press'));
windNext.addEventListener('animationend',()=>windNext.classList.remove('press'));
windPrev.addEventListener('click',()=>{ pressKey(windPrev); stepStage(-1,false); });
windNext.addEventListener('click',()=>{ pressKey(windNext); stepStage(1,false); });
window.addEventListener('keydown',e=>{
  const now=performance.now(), fast=e.repeat || (now-lastStep<260); lastStep=now;   // held key or rapid taps -> accelerate
  if(e.key==='ArrowRight'){e.preventDefault();pressKey(windNext);stepStage(1,fast);}
  else if(e.key==='ArrowLeft'){e.preventDefault();pressKey(windPrev);stepStage(-1,fast);}
  else if(e.key==='Home'){e.preventDefault();goTo(1,700,false);}                    // jump to the worm
  else if(e.key==='End'){e.preventDefault();goTo(2,700,false);}                     // jump to the finished map
});

/* ---------- line explorer: hover / tap a line on the finished map for its story; the rest of the map dims away ---------- */
const INFO={
  J:{ year:1917, from:'Embarcadero', to:'Balboa Park', text:'One of Muni Metro’s original streetcar routes, the J Church has wound past Dolores Park and along the slopes of Noe Valley since 1917. Its street-running curves and steep grades make it one of the network’s most scenic — and most leisurely — rides.' },
  K:{ year:1918, from:'Embarcadero', to:'Balboa Park', text:'Opened in 1918 to spur development of the Ingleside district, the K runs through the Twin Peaks Tunnel and out to Balboa Park, where it now through-routes with the T Third as a single cross-town service.' },
  L:{ year:1919, from:'Embarcadero', to:'SF Zoo', text:'Tracing Taraval Street clear across the Sunset to the SF Zoo and Ocean Beach, the L Taraval has linked downtown with the western edge of the city since 1919, much of it running down the middle of the street.' },
  M:{ year:1925, from:'Embarcadero', to:'Balboa Park', text:'The M Ocean View opened in 1925 and today connects downtown with San Francisco State University and Stonestown, gliding along a dedicated median down the center of 19th Avenue.' },
  N:{ year:1928, from:'Caltrain', to:'Ocean Beach', text:'It is the busiest line in the Muni Metro system, serving an average of 33,100 weekday passengers in June 2025. It was one of San Francisco’s streetcar lines, beginning operation in 1928, and was partially converted to modern light-rail operation with the opening of the Muni Metro system in 1980.' },
  T:{ year:2007, from:'Sunnydale', to:'Chinatown', text:'The system’s newest line, the T Third opened in 2007 to serve the long-overlooked southeastern waterfront. In 2022 the Central Subway carried it underground beneath Market Street to a new terminus in Chinatown.' },
};
const panel=document.getElementById('lineinfo');
const piBadge=panel.querySelector('.li-badge'), piName=panel.querySelector('.li-name'),
      piText=panel.querySelector('.li-text'), piMeta=panel.querySelector('.li-meta');
let pinned=null, hovered=null;   // pinned = typed/clicked (sticky); hovered = pointer preview. Hover wins while present, else falls back to the pinned line.
const isReady=()=>document.body.classList.contains('map-ready');
const eff=()=>hovered||pinned;
function restoreZ(){ Z_ORDER.forEach(k=>linesG.appendChild(paths[TARGETS.indexOf(k)])); }   // back to the designed stack (red under, yellow over)
function paint(){ const k=eff();
  paths.forEach((p,i)=>{ const me=TARGETS[i]===k; p.classList.toggle('hot',me); p.classList.toggle('dim', !!k && !me); });
  restoreZ(); if(k) linesG.appendChild(paths[TARGETS.indexOf(k)]);   // lift the chosen line above the rest so it never hides under an overlap
  if(k) capsG.after(linesG); else capsG.before(linesG);              // while a line is focused, raise the whole #lines group above #caps so the chosen line sits over the end caps (restored on clear)
  landG.classList.toggle('dim', !!k); capsG.classList.toggle('dim', !!k);
  legendChips.forEach(c=>{ c.el.classList.toggle('cur', c.key===k); c.el.classList.toggle('mut', !!k && c.key!==k); });
  if(k){ const m=META[k], info=INFO[k];
    panel.style.setProperty('--c', m.color);
    piBadge.textContent=k; piName.textContent=m.name; piText.textContent=info.text;
    piMeta.innerHTML=`<span>Opened ${info.year}</span><span>${info.from} ↔ ${info.to}</span>`;
    panel.classList.add('show'); document.body.classList.add('line-selected');
  } else { panel.classList.remove('show'); document.body.classList.remove('line-selected'); } }
function setHover(k){ if(!isReady()||hovered===k) return; hovered=k; paint(); }
function dropHover(){ if(hovered===null) return; hovered=null; paint(); }                    // leaving a line / the route list drops the preview, falling back to the pinned line (if any)
function togglePin(k){ if(!isReady()) return; pinned = pinned===k ? null : k; paint(); }      // type a letter or click a line/chip to lock it; same again releases it
function clearSelection(){ if(pinned===null && hovered===null) return; pinned=null; hovered=null; paint(); }
// hover previews, click/tap pins; the legend chip is a bigger, easier target than the thin ribbon
paths.forEach((p,i)=>{ const k=TARGETS[i]; p.classList.add('lnpath');
  p.addEventListener('pointerenter',()=>setHover(k)); p.addEventListener('pointerleave',dropHover); p.addEventListener('click',()=>togglePin(k)); });
legendChips.forEach(c=>{ c.el.addEventListener('pointerenter',()=>setHover(c.key)); c.el.addEventListener('click',()=>togglePin(c.key)); });
legendEl.addEventListener('pointerleave', dropHover);   // leave the route list -> drop the focus on the most-recently-hovered route
// click empty map -> clear; the panel lives outside the screen so clicking it won't dismiss
screenEl.addEventListener('click', e=>{ if(e.target.closest('.legend')||(e.target.classList&&e.target.classList.contains('lnpath'))) return; clearSelection(); });
// keyboard: J K L M N T toggle that line's focus; Esc clears
addEventListener('keydown', e=>{
  if(e.key==='Escape'){ clearSelection(); return; }
  if(!isReady() || e.metaKey || e.ctrlKey || e.altKey) return;
  const k=e.key.toUpperCase();
  if(k.length===1 && 'JKLMNT'.indexOf(k)>=0){ e.preventDefault(); togglePin(k); }
});

/* ---------- start: platform + Clipper only; the case appears on tap-in ---------- */
const qs=new URLSearchParams(location.search);
if(qs.has('t')){ const t=Math.max(0,Math.min(1,parseFloat(qs.get('t'))||0)); POS=1+t; aim=POS; revealCase(); renderMaster(POS);   // ?t= is morph progress (0=worm .. 1=map) -> POS 1..2
  if(POS>=2){ landG.classList.add('show'); capsG.classList.add('show'); legendEl.classList.add('show'); } }
else { POS=0; renderMaster(0); }   // intro: blank screen, worm armed to draw on first step
