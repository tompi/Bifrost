﻿#region License
//
// Copyright (c) 2008-2013, Dolittle (http://www.dolittle.com)
//
// Licensed under the MIT License (http://opensource.org/licenses/MIT)
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at 
//
//   http://github.com/dolittle/Bifrost/blob/master/MIT-LICENSE.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion

namespace Bifrost.Statistics
{
    /// <summary>
    /// A statistics store
    /// </summary>
    public interface IStatisticsStore
    {
        /// <summary>
        /// Record statistics for a given context, event and category
        /// </summary>
        /// <param name="context">Context to record for</param>
        /// <param name="event">Event to record for</param>
        /// <param name="categoryOwner">Owner of the category to record for</param>
        /// <param name="category">Category to record for</param>
        void Record(string context, string @event, string categoryOwner, string category);
    }
}
